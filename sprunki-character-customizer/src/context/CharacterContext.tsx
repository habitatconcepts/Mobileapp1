import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  AccessoryId,
  BackgroundId,
  CharacterConfig,
  ExpressionId,
  OutfitId,
} from '../types/character';
import { characters } from '../constants/characters';

const baseColorForCharacter = (characterId: number): string =>
  characters.find((c) => c.id === characterId)?.baseColor ?? '#888888';

export const defaultConfig: CharacterConfig = {
  characterId: 1,
  baseColor: baseColorForCharacter(1),
  expression: 'happy',
  outfit: null,
  accessories: [],
  background: 'city',
};

type CustomizerAction =
  | { type: 'SET_CHARACTER'; characterId: number }
  | { type: 'SET_BASE_COLOR'; color: string }
  | { type: 'SET_EXPRESSION'; expression: ExpressionId }
  | { type: 'SET_OUTFIT'; outfit: OutfitId }
  | { type: 'TOGGLE_ACCESSORY'; accessory: AccessoryId }
  | { type: 'SET_BACKGROUND'; background: BackgroundId }
  | { type: 'REPLACE_CONFIG'; config: CharacterConfig }
  | { type: 'RESET' };

function customizerReducer(state: CharacterConfig, action: CustomizerAction): CharacterConfig {
  switch (action.type) {
    case 'SET_CHARACTER':
      return {
        ...state,
        characterId: action.characterId,
        baseColor: baseColorForCharacter(action.characterId),
      };
    case 'SET_BASE_COLOR':
      return { ...state, baseColor: action.color };
    case 'SET_EXPRESSION':
      return { ...state, expression: action.expression };
    case 'SET_OUTFIT':
      return { ...state, outfit: action.outfit };
    case 'TOGGLE_ACCESSORY':
      return {
        ...state,
        accessories: state.accessories.indexOf(action.accessory) === -1
          ? [...state.accessories, action.accessory]
          : state.accessories.filter((a) => a !== action.accessory),
      };
    case 'SET_BACKGROUND':
      return { ...state, background: action.background };
    case 'REPLACE_CONFIG':
      return { ...action.config, accessories: [...action.config.accessories] };
    case 'RESET':
      return { ...defaultConfig, accessories: [] };
    default:
      return state;
  }
}

export interface CustomizerContextValue {
  config: CharacterConfig;
  setCharacter: (id: number) => void;
  setBaseColor: (color: string) => void;
  setExpression: (expression: ExpressionId) => void;
  setOutfit: (outfit: OutfitId) => void;
  toggleAccessory: (accessory: AccessoryId) => void;
  setBackground: (background: BackgroundId) => void;
  /** Replace the whole config (used when loading a saved character back into the customizer). */
  replaceConfig: (config: CharacterConfig) => void;
  reset: () => void;
}

const CharacterContext = createContext<CustomizerContextValue | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [config, dispatch] = useReducer(customizerReducer, defaultConfig);

  const setCharacter = useCallback((id: number) => {
    dispatch({ type: 'SET_CHARACTER', characterId: id });
  }, []);
  const setBaseColor = useCallback((color: string) => {
    dispatch({ type: 'SET_BASE_COLOR', color });
  }, []);
  const setExpression = useCallback((expression: ExpressionId) => {
    dispatch({ type: 'SET_EXPRESSION', expression });
  }, []);
  const setOutfit = useCallback((outfit: OutfitId) => {
    dispatch({ type: 'SET_OUTFIT', outfit });
  }, []);
  const toggleAccessory = useCallback((accessory: AccessoryId) => {
    dispatch({ type: 'TOGGLE_ACCESSORY', accessory });
  }, []);
  const setBackground = useCallback((background: BackgroundId) => {
    dispatch({ type: 'SET_BACKGROUND', background });
  }, []);
  const replaceConfig = useCallback((next: CharacterConfig) => {
    dispatch({ type: 'REPLACE_CONFIG', config: next });
  }, []);
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo<CustomizerContextValue>(
    () => ({
      config,
      setCharacter,
      setBaseColor,
      setExpression,
      setOutfit,
      toggleAccessory,
      setBackground,
      replaceConfig,
      reset,
    }),
    [
      config,
      setCharacter,
      setBaseColor,
      setExpression,
      setOutfit,
      toggleAccessory,
      setBackground,
      replaceConfig,
      reset,
    ],
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCustomizer(): CustomizerContextValue {
  const ctx = useContext(CharacterContext);
  if (!ctx) {
    throw new Error('useCustomizer must be used within a CharacterProvider');
  }
  return ctx;
}
