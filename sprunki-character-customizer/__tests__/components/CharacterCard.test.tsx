import React from 'react';
import { render } from '@testing-library/react-native';
import CharacterCard from '../../src/components/CharacterCard';

describe('CharacterCard', () => {
  const mockCharacter = {
    name: 'Sprunki',
    outfit: 'Casual',
    accessories: ['Glasses'],
    expression: 'Happy',
    background: 'Blue',
  };

  it('renders correctly with character data', () => {
    const { getByText } = render(<CharacterCard character={mockCharacter} />);
    
    expect(getByText('Sprunki')).toBeTruthy();
    expect(getByText('Outfit: Casual')).toBeTruthy();
    expect(getByText('Accessories: Glasses')).toBeTruthy();
    expect(getByText('Expression: Happy')).toBeTruthy();
  });

  it('displays the correct background color', () => {
    const { getByTestId } = render(<CharacterCard character={mockCharacter} />);
    
    const card = getByTestId('character-card');
    expect(card.props.style.backgroundColor).toBe('Blue');
  });
});