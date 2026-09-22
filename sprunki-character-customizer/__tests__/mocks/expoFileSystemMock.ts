// Minimal jest mock: importing expo-file-system must not crash the suite.
// startNativeAudio is never exercised under jest (it is native-only).
export const Paths = {
  cache: { uri: 'file:///mock-cache/' },
  document: { uri: 'file:///mock-document/' },
};

export class File {
  uri: string;
  constructor(...parts: unknown[]) {
    this.uri = `file:///mock-cache/${String(parts[parts.length - 1] ?? 'mock.wav')}`;
  }
  writableStream(): {
    getWriter: () => { write: () => Promise<void>; close: () => Promise<void> };
  } {
    return {
      getWriter: () => ({
        write: async (): Promise<void> => {},
        close: async (): Promise<void> => {},
      }),
    };
  }
}

export const EncodingType = { Base64: 'base64' };
