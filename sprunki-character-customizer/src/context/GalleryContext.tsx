import React, { createContext, useState, useContext } from 'react';

interface GalleryContextType {
  gallery: string[];
  addCharacterToGallery: (character: string) => void;
  removeCharacterFromGallery: (character: string) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gallery, setGallery] = useState<string[]>([]);

  const addCharacterToGallery = (character: string) => {
    setGallery((prevGallery) => [...prevGallery, character]);
  };

  const removeCharacterFromGallery = (character: string) => {
    setGallery((prevGallery) => prevGallery.filter((item) => item !== character));
  };

  return (
    <GalleryContext.Provider value={{ gallery, addCharacterToGallery, removeCharacterFromGallery }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};