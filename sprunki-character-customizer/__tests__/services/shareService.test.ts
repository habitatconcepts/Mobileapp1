import type { RefObject } from 'react';
import { Share, type View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { describeCustomization, shareCharacterImage } from '../../src/services/shareService';
import type { CharacterConfig } from '../../src/types/character';

jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(),
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

const mockCaptureRef = captureRef as jest.Mock;
const mockIsAvailable = Sharing.isAvailableAsync as jest.Mock;
const mockShareAsync = Sharing.shareAsync as jest.Mock;
const mockRnShare = jest.spyOn(Share, 'share');

const CONFIG: CharacterConfig = {
  characterId: 1,
  baseColor: '#FF5733',
  expression: 'happy',
  outfit: 'casual',
  accessories: ['hat', 'scarf'],
  background: 'city',
};

const previewRef = { current: {} as View } as RefObject<View | null>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('describeCustomization', () => {
  it('summarizes the config as human-readable text', () => {
    const text = describeCustomization(CONFIG);
    expect(text).toContain('Sprunki One');
    expect(text).toContain('Happy');
    expect(text).toContain('Casual');
    expect(text).toContain('Hat, Scarf');
    expect(text).toContain('City');
  });

  it('handles empty accessories and no outfit', () => {
    const text = describeCustomization({ ...CONFIG, outfit: null, accessories: [] });
    expect(text).toContain('Outfit: None');
    expect(text).toContain('Accessories: None');
  });
});

describe('shareCharacterImage', () => {
  it('captures the preview and shares the PNG when available', async () => {
    mockCaptureRef.mockResolvedValue('file:///tmp/preview.png');
    mockIsAvailable.mockResolvedValue(true);

    const outcome = await shareCharacterImage(previewRef, CONFIG);

    expect(outcome).toBe('image-shared');
    expect(mockCaptureRef).toHaveBeenCalled();
    expect(mockShareAsync).toHaveBeenCalledWith('file:///tmp/preview.png', expect.objectContaining({
      mimeType: 'image/png',
    }));
    expect(mockRnShare).not.toHaveBeenCalled();
  });

  it('falls back to text share when capture fails', async () => {
    mockCaptureRef.mockRejectedValue(new Error('capture failed'));
    mockRnShare.mockResolvedValue({ action: Share.sharedAction });

    const outcome = await shareCharacterImage(previewRef, CONFIG);

    expect(outcome).toBe('text-shared');
    expect(mockRnShare).toHaveBeenCalledWith({
      message: expect.stringContaining('Sprunki One'),
    });
  });

  it('falls back to text share when image sharing is unavailable', async () => {
    mockCaptureRef.mockResolvedValue('file:///tmp/preview.png');
    mockIsAvailable.mockResolvedValue(false);
    mockRnShare.mockResolvedValue({ action: Share.sharedAction });

    const outcome = await shareCharacterImage(previewRef, CONFIG);

    expect(outcome).toBe('text-shared');
    expect(mockShareAsync).not.toHaveBeenCalled();
    expect(mockRnShare).toHaveBeenCalled();
  });

  it('never throws, even when everything fails', async () => {
    mockCaptureRef.mockRejectedValue(new Error('nope'));
    mockRnShare.mockRejectedValue(new Error('nope'));

    await expect(shareCharacterImage(previewRef, CONFIG)).resolves.toBe('unavailable');
  });
});
