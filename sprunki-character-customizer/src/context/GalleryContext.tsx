import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CharacterConfig } from '../types/character';
import { useCustomizer } from './CharacterContext';
import { clearGalleryStorage, loadGalleryStorage, saveGalleryStorage } from '../services/storageService';

export interface SavedCharacter {
  id: string;
  config: CharacterConfig;
  createdAt: string;
}

export interface GalleryContextValue {
  saved: SavedCharacter[];
  /** Total customizations ever saved (persisted; survives deletions, cleared on data reset). */
  customizationCount: number;
  addToGallery: (config: CharacterConfig) => Promise<SavedCharacter>;
  removeFromGallery: (id: string) => void;
  /** Load a saved character back into the customizer so the user can re-edit it. */
  loadIntoCustomizer: (saved: SavedCharacter) => void;
  clearGallery: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextValue | undefined>(undefined);

const makeId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function GalleryProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [saved, setSaved] = useState<SavedCharacter[]>([]);
  const [customizationCount, setCustomizationCount] = useState(0);
  const { replaceConfig } = useCustomizer();

  useEffect(() => {
    let cancelled = false;
    loadGalleryStorage().then(({ items, customizationCount: count }) => {
      if (!cancelled) {
        setSaved(items);
        setCustomizationCount(count);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const addToGallery = useCallback(
    async (config: CharacterConfig): Promise<SavedCharacter> => {
      const entry: SavedCharacter = {
        id: makeId(),
        config: { ...config, accessories: [...config.accessories] },
        createdAt: new Date().toISOString(),
      };
      const next = [entry, ...saved];
      const nextCount = customizationCount + 1;
      setSaved(next);
      setCustomizationCount(nextCount);
      await saveGalleryStorage(next, nextCount);
      return entry;
    },
    [saved, customizationCount],
  );

  const removeFromGallery = useCallback(
    (id: string) => {
      const next = saved.filter((item) => item.id !== id);
      setSaved(next);
      saveGalleryStorage(next, customizationCount).catch(() => {
        // Persistence is best-effort; the in-memory state is already updated.
      });
    },
    [saved, customizationCount],
  );

  const loadIntoCustomizer = useCallback(
    (entry: SavedCharacter) => {
      replaceConfig(entry.config);
    },
    [replaceConfig],
  );

  const clearGallery = useCallback(async () => {
    await clearGalleryStorage();
    setSaved([]);
    setCustomizationCount(0);
  }, []);

  const value = useMemo<GalleryContextValue>(
    () => ({
      saved,
      customizationCount,
      addToGallery,
      removeFromGallery,
      loadIntoCustomizer,
      clearGallery,
    }),
    [saved, customizationCount, addToGallery, removeFromGallery, loadIntoCustomizer, clearGallery],
  );

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return ctx;
}
