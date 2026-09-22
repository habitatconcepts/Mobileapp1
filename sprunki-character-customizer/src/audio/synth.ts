import type { Phase } from '../types/character';

/**
 * Procedural music synth for the Sprunki performance mode.
 *
 * Each of the four characters gets its own 2-bar loop at 120 BPM, generated
 * as 16-bit PCM WAV bytes with zero audio assets:
 *   1 — drummer: four-on-the-floor kick + hats
 *   2 — bassist: bouncy bassline
 *   3 — keys: Am–F–C–G pad stabs
 *   4 — lead: pentatonic pluck arpeggio
 *
 * Horror phase transposes everything down, adds a sub rumble and an uneasy
 * tremolo. Generation is fully deterministic (seeded noise) so loops and
 * tests are reproducible.
 */

export const SYNTH_SAMPLE_RATE = 22050;
export const SYNTH_BPM = 120;
export const SYNTH_BEATS = 8; // two bars of 4/4
export const BEAT_SECONDS = 60 / SYNTH_BPM;
export const LOOP_SECONDS = BEAT_SECONDS * SYNTH_BEATS;
export const LOOP_SAMPLES = Math.floor(SYNTH_SAMPLE_RATE * LOOP_SECONDS);

const TAU = Math.PI * 2;

/** Deterministic PRNG so every build of the same loop sounds identical. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const semi = (freq: number, n: number): number => freq * Math.pow(2, n / 12);

type Osc = (phase: number) => number;
const sine: Osc = (p) => Math.sin(p);
const tri: Osc = (p) => (2 / Math.PI) * Math.asin(Math.sin(p));
/** Cheap saw-ish: fundamental + softened harmonics. */
const softSaw: Osc = (p) =>
  Math.sin(p) + 0.5 * Math.sin(2 * p) + 0.33 * Math.sin(3 * p) + 0.2 * Math.sin(4 * p);

interface VoiceOptions {
  osc?: Osc;
  attack?: number;
  decay?: number;
  detuneBeats?: number; // slow tremolo for horror unease
}

/**
 * Render a single note into the mix buffer.
 */
function note(
  mix: Float32Array,
  rand: () => number,
  opts: {
    freq: number;
    startBeat: number;
    beats: number;
    gain?: number;
    osc?: Osc;
    attack?: number;
    horror?: boolean;
    noiseMix?: number;
  },
): void {
  const {
    freq,
    startBeat,
    beats,
    gain = 0.5,
    osc = sine,
    attack = 0.005,
    horror = false,
    noiseMix = 0,
  } = opts;
  const start = Math.floor(startBeat * BEAT_SECONDS * SYNTH_SAMPLE_RATE);
  const len = Math.floor(beats * BEAT_SECONDS * SYNTH_SAMPLE_RATE);
  const end = Math.min(mix.length, start + len);
  const f = horror ? semi(freq, -4) : freq;
  for (let i = start; i < end; i++) {
    const t = (i - start) / SYNTH_SAMPLE_RATE;
    const life = t / (beats * BEAT_SECONDS);
    const env =
      Math.min(1, t / attack) * Math.pow(1 - life, 1.6);
    let s = osc(TAU * f * t);
    if (noiseMix > 0) s = s * (1 - noiseMix) + (rand() * 2 - 1) * noiseMix;
    if (horror) {
      // uneasy slow tremolo + slight detuned chorus
      s = s * (0.75 + 0.25 * Math.sin(TAU * 2.2 * t));
      s += 0.3 * osc(TAU * semi(f, 0.35) * t);
    }
    mix[i] += s * env * gain;
  }
}

/** Percussive hit: pitch-dropping sine (kick) or filtered noise (hat/snare). */
function hit(
  mix: Float32Array,
  rand: () => number,
  opts: {
    startBeat: number;
    kind: 'kick' | 'hat' | 'snare';
    gain?: number;
    horror?: boolean;
  },
): void {
  const { startBeat, kind, gain = 0.8, horror = false } = opts;
  const start = Math.floor(startBeat * BEAT_SECONDS * SYNTH_SAMPLE_RATE);
  const dur = kind === 'hat' ? 0.06 : kind === 'snare' ? 0.16 : 0.28;
  const len = Math.floor(dur * SYNTH_SAMPLE_RATE);
  const end = Math.min(mix.length, start + len);
  for (let i = start; i < end; i++) {
    const t = (i - start) / SYNTH_SAMPLE_RATE;
    const env = Math.exp(-t * (kind === 'kick' ? 14 : kind === 'snare' ? 22 : 60));
    let s: number;
    if (kind === 'kick') {
      const f = (horror ? 105 : 150) * Math.exp(-t * 22) + (horror ? 32 : 44);
      s = Math.sin(TAU * f * t);
    } else {
      // noise burst; snare adds a 190Hz body tone
      s = (rand() * 2 - 1) * (kind === 'snare' ? 0.6 : 1);
      if (kind === 'snare') s += 0.5 * Math.sin(TAU * (horror ? 150 : 190) * t);
    }
    mix[i] += s * env * gain;
  }
}

const CHORDS: number[][] = [
  [110.0, 130.81, 164.81], // Am
  [87.31, 110.0, 130.81], // F
  [130.81, 164.81, 196.0], // C
  [98.0, 123.47, 146.83], // G
];

const LEAD_LINE = [440, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25];
const BASS_LINE = [0, 0, 12, 3, 0, 0, -2, 7]; // semitones from A1 (55 Hz)

function renderVoice(mix: Float32Array, rand: () => number, characterId: number, horror: boolean): void {
  switch (characterId) {
    case 1: {
      // drummer
      for (let b = 0; b < SYNTH_BEATS; b++) {
        hit(mix, rand, { startBeat: b, kind: 'kick', horror });
        hit(mix, rand, { startBeat: b + 0.5, kind: 'hat', gain: 0.28, horror });
      }
      hit(mix, rand, { startBeat: 2, kind: 'snare', horror });
      hit(mix, rand, { startBeat: 6, kind: 'snare', horror });
      break;
    }
    case 2: {
      // bassist
      BASS_LINE.forEach((st, b) => {
        note(mix, rand, {
          freq: semi(55, st),
          startBeat: b,
          beats: 0.9,
          gain: 0.55,
          osc: (p) => Math.sin(p) + 0.4 * Math.sin(2 * p),
          horror,
        });
      });
      for (let b = 0; b < SYNTH_BEATS; b++) {
        hit(mix, rand, { startBeat: b + 0.5, kind: 'hat', gain: 0.16, horror });
      }
      break;
    }
    case 3: {
      // keys: one chord every 2 beats
      CHORDS.forEach((chord, ci) => {
        chord.forEach((f) => {
          note(mix, rand, {
            freq: f,
            startBeat: ci * 2,
            beats: 1.9,
            gain: 0.16,
            osc: softSaw,
            attack: 0.25,
            horror,
          });
        });
      });
      for (let b = 0; b < SYNTH_BEATS; b += 2) {
        hit(mix, rand, { startBeat: b, kind: 'kick', gain: 0.5, horror });
      }
      break;
    }
    default: {
      // lead: plucked pentatonic line
      LEAD_LINE.forEach((f, b) => {
        note(mix, rand, {
          freq: f,
          startBeat: b,
          beats: 0.85,
          gain: 0.34,
          osc: tri,
          horror,
        });
        // sparkle octave shimmer
        note(mix, rand, {
          freq: f * 2,
          startBeat: b,
          beats: 0.4,
          gain: 0.1,
          osc: sine,
          horror,
        });
      });
      break;
    }
  }
  if (horror) {
    // low dread rumble under everything
    note(mix, rand, {
      freq: 36,
      startBeat: 0,
      beats: SYNTH_BEATS,
      gain: 0.22,
      osc: sine,
      attack: 0.8,
      horror: false,
    });
  }
}

/** Soft-clip + normalize the mix in place. */
function master(mix: Float32Array): void {
  let peak = 0;
  for (let i = 0; i < mix.length; i++) {
    mix[i] = Math.tanh(mix[i] * 1.1);
    const a = Math.abs(mix[i]);
    if (a > peak) peak = a;
  }
  const g = peak > 0 ? 0.85 / peak : 1;
  for (let i = 0; i < mix.length; i++) mix[i] *= g;
}

function encodeWav(mix: Float32Array): Uint8Array {
  const n = mix.length;
  const buf = new Uint8Array(44 + n * 2);
  const dv = new DataView(buf.buffer);
  const writeStr = (off: number, s: string): void => {
    for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  dv.setUint32(4, 36 + n * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true); // PCM
  dv.setUint16(22, 1, true); // mono
  dv.setUint32(24, SYNTH_SAMPLE_RATE, true);
  dv.setUint32(28, SYNTH_SAMPLE_RATE * 2, true);
  dv.setUint16(32, 2, true);
  dv.setUint16(34, 16, true);
  writeStr(36, 'data');
  dv.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, mix[i]));
    dv.setInt16(44 + i * 2, Math.round(v * 32767), true);
  }
  return buf;
}

const voiceFor = (characterId: number): number => ((characterId - 1) % 4 + 4) % 4 + 1;

/**
 * Synthesize the character's performance loop as WAV bytes.
 * Deterministic: identical inputs always produce identical bytes.
 */
export function synthesizeLoop(characterId: number, phase: Phase): Uint8Array {
  const voice = voiceFor(characterId);
  const horror = phase === 'horror';
  const rand = mulberry32(voice * 7919 + (horror ? 13 : 7));
  const mix = new Float32Array(LOOP_SAMPLES);
  renderVoice(mix, rand, voice, horror);
  master(mix);
  return encodeWav(mix);
}
