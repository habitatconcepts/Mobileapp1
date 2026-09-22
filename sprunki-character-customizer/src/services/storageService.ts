import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedCharacter } from '../context/GalleryContext';

const GALLERY_KEY = '@sprunki/gallery/v1';
const COUNT_KEY = '@sprunki/customization-count/v1';

interface GalleryStore {
  items: SavedCharacter[];
  customizationCount: number;
}

const isSavedCharacter = (value: unknown): value is SavedCharacter => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === 'string' && typeof v.config === 'object' && v.config !== null;
};

export async function loadGalleryStorage(): Promise<GalleryStore> {
  try {
    const [rawItems, rawCount] = await Promise.all([
      AsyncStorage.getItem(GALLERY_KEY),
      AsyncStorage.getItem(COUNT_KEY),
    ]);
    const parsed: unknown = rawItems != null ? JSON.parse(rawItems) : [];
    const items = Array.isArray(parsed) ? parsed.filter(isSavedCharacter) : [];
    const customizationCount = rawCount != null ? Number.parseInt(rawCount, 10) || 0 : 0;
    return { items, customizationCount };
  } catch {
    return { items: [], customizationCount: 0 };
  }
}

export async function saveGalleryStorage(
  items: SavedCharacter[],
  customizationCount: number,
): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(GALLERY_KEY, JSON.stringify(items)),
    AsyncStorage.setItem(COUNT_KEY, String(customizationCount)),
  ]);
}

export async function clearGalleryStorage(): Promise<void> {
  await Promise.all([AsyncStorage.removeItem(GALLERY_KEY), AsyncStorage.removeItem(COUNT_KEY)]);
}
