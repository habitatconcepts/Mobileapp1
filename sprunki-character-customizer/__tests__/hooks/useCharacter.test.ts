import { renderHook, act } from '@testing-library/react-hooks';
import { useCharacter } from '../../src/hooks/useCharacter';

describe('useCharacter', () => {
  it('should initialize with default character state', () => {
    const { result } = renderHook(() => useCharacter());
    expect(result.current.character).toEqual(expect.any(Object));
    expect(result.current.character).toHaveProperty('name');
    expect(result.current.character).toHaveProperty('accessories');
    expect(result.current.character).toHaveProperty('outfit');
  });

  it('should update character name', () => {
    const { result } = renderHook(() => useCharacter());
    act(() => {
      result.current.setCharacterName('Sprunki');
    });
    expect(result.current.character.name).toBe('Sprunki');
  });

  it('should add an accessory', () => {
    const { result } = renderHook(() => useCharacter());
    act(() => {
      result.current.addAccessory('hat');
    });
    expect(result.current.character.accessories).toContain('hat');
  });

  it('should remove an accessory', () => {
    const { result } = renderHook(() => useCharacter());
    act(() => {
      result.current.addAccessory('hat');
      result.current.removeAccessory('hat');
    });
    expect(result.current.character.accessories).not.toContain('hat');
  });

  it('should update outfit', () => {
    const { result } = renderHook(() => useCharacter());
    act(() => {
      result.current.setOutfit('casual');
    });
    expect(result.current.character.outfit).toBe('casual');
  });
});