import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CharacterCard from '../../src/components/CharacterCard';
import { characters } from '../../src/constants/characters';

// CharacterFigure draws with react-native-svg; mock it so this test stays
// focused on the card layout and press behavior.
jest.mock('../../src/components/CharacterFigure', () => 'CharacterFigure');

describe('CharacterCard', () => {
  const character = characters[0];

  it('renders the character name and description', async () => {
    const { getByText } = await render(<CharacterCard character={character} onPress={() => {}} />);
    expect(getByText(character.name)).toBeTruthy();
    expect(getByText(character.description)).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(
      <CharacterCard character={character} onPress={onPress} />,
    );
    await fireEvent.press(getByTestId(`character-card-${character.id}`));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
