import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { CharacterProvider, useCustomizer } from '../../src/context/CharacterContext';
import type { CharacterConfig } from '../../src/types/character';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CharacterProvider>{children}</CharacterProvider>
);

const DEFAULTS: CharacterConfig = {
  characterId: 1,
  baseColor: '#FF5733',
  expression: 'happy',
  outfit: null,
  accessories: [],
  background: 'city',
};

describe('useCustomizer', () => {
  it('starts with the default config', async () => {
    const { result } = await renderHook(() => useCustomizer(), { wrapper });
    expect(result.current.config).toEqual(DEFAULTS);
  });

  it('setExpression updates the config expression', async () => {
    const { result } = await renderHook(() => useCustomizer(), { wrapper });
    await act(() => {
      result.current.setExpression('sad');
    });
    expect(result.current.config.expression).toBe('sad');
  });

  it('toggleAccessory adds then removes an accessory', async () => {
    const { result } = await renderHook(() => useCustomizer(), { wrapper });
    await act(() => {
      result.current.toggleAccessory('hat');
    });
    expect(result.current.config.accessories).toEqual(['hat']);

    await act(() => {
      result.current.toggleAccessory('sunglasses');
    });
    expect(result.current.config.accessories).toEqual(['hat', 'sunglasses']);

    await act(() => {
      result.current.toggleAccessory('hat');
    });
    expect(result.current.config.accessories).toEqual(['sunglasses']);
  });

  it('setCharacter switches character and resets to its base color', async () => {
    const { result } = await renderHook(() => useCustomizer(), { wrapper });
    await act(() => {
      result.current.setBaseColor('#000000');
      result.current.setCharacter(3);
    });
    expect(result.current.config.characterId).toBe(3);
    expect(result.current.config.baseColor).toBe('#3357FF');
  });

  it('setOutfit, setBackground and setBaseColor update the config', async () => {
    const { result } = await renderHook(() => useCustomizer(), { wrapper });
    await act(() => {
      result.current.setOutfit('casual');
      result.current.setBackground('space');
      result.current.setBaseColor('#123456');
    });
    expect(result.current.config.outfit).toBe('casual');
    expect(result.current.config.background).toBe('space');
    expect(result.current.config.baseColor).toBe('#123456');

    await act(() => {
      result.current.setOutfit(null);
    });
    expect(result.current.config.outfit).toBeNull();
  });

  it('replaceConfig swaps in a whole saved config', async () => {
    const { result } = await renderHook(() => useCustomizer(), { wrapper });
    const saved: CharacterConfig = {
      characterId: 2,
      baseColor: '#ABCDEF',
      expression: 'excited',
      outfit: 'fantasy',
      accessories: ['scarf'],
      background: 'desert',
    };
    await act(() => {
      result.current.replaceConfig(saved);
    });
    expect(result.current.config).toEqual(saved);
  });

  it('reset restores the default config', async () => {
    const { result } = await renderHook(() => useCustomizer(), { wrapper });
    await act(() => {
      result.current.setExpression('angry');
      result.current.toggleAccessory('backpack');
      result.current.setOutfit('horror');
      result.current.reset();
    });
    expect(result.current.config).toEqual(DEFAULTS);
  });

  it('throws when used outside the provider', async () => {
    const { result } = await renderHook(() => {
      try {
        return useCustomizer();
      } catch (e) {
        return (e as Error).message;
      }
    });
    expect(result.current).toBe('useCustomizer must be used within a CharacterProvider');
  });
});
