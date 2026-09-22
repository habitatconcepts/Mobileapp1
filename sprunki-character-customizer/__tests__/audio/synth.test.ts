import {
  BEAT_SECONDS,
  LOOP_SAMPLES,
  LOOP_SECONDS,
  SYNTH_BEATS,
  SYNTH_BPM,
  SYNTH_SAMPLE_RATE,
  synthesizeLoop,
} from '../../src/audio/synth';

const readStr = (bytes: Uint8Array, off: number, len: number): string =>
  String.fromCharCode(...bytes.slice(off, off + len));

describe('synthesizeLoop', () => {
  it('exposes sane musical constants', () => {
    expect(SYNTH_BPM).toBe(120);
    expect(SYNTH_BEATS).toBe(8);
    expect(BEAT_SECONDS).toBeCloseTo(0.5, 5);
    expect(LOOP_SECONDS).toBeCloseTo(4, 5);
    expect(LOOP_SAMPLES).toBe(Math.floor(SYNTH_SAMPLE_RATE * LOOP_SECONDS));
  });

  it('produces a valid 16-bit PCM WAV', () => {
    const wav = synthesizeLoop(1, 'normal');
    expect(wav.length).toBe(44 + LOOP_SAMPLES * 2);
    expect(readStr(wav, 0, 4)).toBe('RIFF');
    expect(readStr(wav, 8, 4)).toBe('WAVE');
    expect(readStr(wav, 12, 4)).toBe('fmt ');
    expect(readStr(wav, 36, 4)).toBe('data');
    const dv = new DataView(wav.buffer);
    expect(dv.getUint16(20, true)).toBe(1); // PCM
    expect(dv.getUint16(22, true)).toBe(1); // mono
    expect(dv.getUint32(24, true)).toBe(SYNTH_SAMPLE_RATE);
    expect(dv.getUint16(34, true)).toBe(16);
    expect(dv.getUint32(40, true)).toBe(LOOP_SAMPLES * 2);
  });

  it('is deterministic for identical inputs', () => {
    const a = synthesizeLoop(2, 'normal');
    const b = synthesizeLoop(2, 'normal');
    expect(a).toEqual(b);
  });

  it('gives each character a distinct voice and horror a distinct mix', () => {
    const voices = [1, 2, 3, 4].map((id) => synthesizeLoop(id, 'normal'));
    for (let i = 0; i < voices.length; i++) {
      for (let j = i + 1; j < voices.length; j++) {
        expect(voices[i]).not.toEqual(voices[j]);
      }
    }
    expect(synthesizeLoop(1, 'horror')).not.toEqual(synthesizeLoop(1, 'normal'));
  });

  it('wraps out-of-range character ids onto the four voices', () => {
    expect(synthesizeLoop(5, 'normal')).toEqual(synthesizeLoop(1, 'normal'));
    expect(synthesizeLoop(0, 'normal')).toEqual(synthesizeLoop(4, 'normal'));
  });

  it('produces audible, normalized audio', () => {
    const wav = synthesizeLoop(4, 'normal');
    const dv = new DataView(wav.buffer);
    let peak = 0;
    for (let i = 0; i < LOOP_SAMPLES; i += 7) {
      const v = Math.abs(dv.getInt16(44 + i * 2, true) / 32767);
      if (v > peak) peak = v;
    }
    expect(peak).toBeGreaterThan(0.3); // clearly audible
    expect(peak).toBeLessThanOrEqual(0.86); // normalized with headroom
  });
});
