// Minimal jest mock: importing expo-audio must not crash the suite.
// startNativeAudio is never exercised under jest (it is native-only).
export const createAudioPlayer = (): {
  loop: boolean;
  play: () => void;
  pause: () => void;
  remove: () => void;
} => ({
  loop: false,
  play: (): void => {},
  pause: (): void => {},
  remove: (): void => {},
});
