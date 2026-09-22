import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CharacterProvider, useCustomizer } from '../../src/context/CharacterContext';
import { GalleryProvider, useGallery } from '../../src/context/GalleryContext';
import type { CharacterConfig } from '../../src/types/character';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CharacterProvider>
    <GalleryProvider>{children}</GalleryProvider>
  </CharacterProvider>
);

const CONFIG: CharacterConfig = {
  characterId: 1,
  baseColor: '#FF5733',
  expression: 'excited',
  outfit: 'sporty',
  accessories: ['hat'],
  background: 'city',
  phase: 'normal',
};

const flushPromises = () => act(async () => {});

beforeEach(() => {
  jest.clearAllMocks();
  mockGetItem.mockResolvedValue(null);
});

describe('useGallery', () => {
  it('loads an empty gallery when storage is empty', async () => {
    const { result } = await renderHook(() => useGallery(), { wrapper });
    await flushPromises();
    expect(result.current.saved).toEqual([]);
    expect(result.current.customizationCount).toBe(0);
  });

  it('hydrates saved characters from storage on mount', async () => {
    const stored = [{ id: 'abc', config: CONFIG, createdAt: '2026-09-22T00:00:00.000Z' }];
    mockGetItem.mockImplementation((key: string) =>
      Promise.resolve(key === '@sprunki/gallery/v1' ? JSON.stringify(stored) : '3'),
    );
    const { result } = await renderHook(() => useGallery(), { wrapper });
    await flushPromises();
    expect(result.current.saved).toEqual(stored);
    expect(result.current.customizationCount).toBe(3);
  });

  it('addToGallery saves the entry and persists it to AsyncStorage', async () => {
    const { result } = await renderHook(() => useGallery(), { wrapper });
    await flushPromises();

    let entryId = '';
    await act(async () => {
      const entry = await result.current.addToGallery(CONFIG);
      entryId = entry.id;
    });

    expect(entryId).toBeTruthy();
    expect(result.current.saved).toHaveLength(1);
    expect(result.current.saved[0].config).toEqual(CONFIG);
    expect(result.current.customizationCount).toBe(1);

    expect(mockSetItem).toHaveBeenCalledWith(
      '@sprunki/gallery/v1',
      expect.stringContaining(entryId),
    );
    const persistedRaw = mockSetItem.mock.calls.find(
      (call) => call[0] === '@sprunki/gallery/v1',
    )?.[1] as string;
    const persisted = JSON.parse(persistedRaw);
    expect(persisted[0].config).toEqual(CONFIG);
    expect(mockSetItem).toHaveBeenCalledWith('@sprunki/customization-count/v1', '1');
  });

  it('removeFromGallery deletes the entry and persists the change', async () => {
    const { result } = await renderHook(() => useGallery(), { wrapper });
    await flushPromises();

    await act(async () => {
      await result.current.addToGallery(CONFIG);
    });
    const id = result.current.saved[0].id;

    await act(() => {
      result.current.removeFromGallery(id);
    });

    expect(result.current.saved).toEqual([]);
    const lastGalleryWrite = mockSetItem.mock.calls
      .filter((call) => call[0] === '@sprunki/gallery/v1')
      .pop()?.[1] as string;
    expect(JSON.parse(lastGalleryWrite)).toEqual([]);
  });

  it('loadIntoCustomizer pushes the saved config into the customizer', async () => {
    const { result } = await renderHook(
      () => ({ gallery: useGallery(), customizer: useCustomizer() }),
      { wrapper },
    );
    await flushPromises();

    let savedEntry = result.current.gallery.saved[0];
    await act(async () => {
      savedEntry = await result.current.gallery.addToGallery(CONFIG);
    });

    await act(() => {
      result.current.gallery.loadIntoCustomizer(savedEntry);
    });

    expect(result.current.customizer.config).toEqual(CONFIG);
  });

  it('throws when used outside the provider', async () => {
    const { result } = await renderHook(() => {
      try {
        return useGallery();
      } catch (e) {
        return (e as Error).message;
      }
    });
    expect(result.current).toBe('useGallery must be used within a GalleryProvider');
  });
});
