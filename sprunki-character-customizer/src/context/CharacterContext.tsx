import React, { createContext, useContext, useState } from 'react';
import { Character } from '../types/character';
import { Customization } from '../types/customization';

interface CharacterContextType {
  character: Character | null;
  customization: Customization;
  setCharacter: (character: Character) => void;
  updateCustomization: (customization: Partial<Customization>) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [customization, setCustomization] = useState<Customization>({
    outfit: null,
    accessories: [],
    colors: {},
    expression: null,
  });

  const updateCustomization = (newCustomization: Partial<Customization>) => {
    setCustomization((prev) => ({ ...prev, ...newCustomization }));
  };

  return (
    <CharacterContext.Provider value={{ character, customization, setCharacter, updateCustomization }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = (): CharacterContextType => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};