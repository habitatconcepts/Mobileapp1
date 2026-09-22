import { toBase64 } from '../../src/audio/performAudio';

describe('toBase64', () => {
  it('encodes bytes to standard base64', () => {
    expect(toBase64(new Uint8Array([77, 97, 110]))).toBe('TWFu'); // "Man"
    expect(toBase64(new Uint8Array([77, 97]))).toBe('TWE='); // "Ma"
    expect(toBase64(new Uint8Array([77]))).toBe('TQ=='); // "M"
    expect(toBase64(new Uint8Array([]))).toBe('');
  });

  it('round-trips through the platform decoder', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 255, 16, 32, 64, 128]);
    const decoded = Buffer.from(toBase64(bytes), 'base64');
    expect(new Uint8Array(decoded)).toEqual(bytes);
  });
});
