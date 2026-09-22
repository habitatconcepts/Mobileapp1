import React from 'react';
import { render } from '@testing-library/react-native';
import CharacterFigure from '../../src/components/CharacterFigure';
import type {
  AccessoryId,
  CharacterConfig,
  ExpressionId,
  OutfitId,
} from '../../src/types/character';

const EXPRESSIONS: ExpressionId[] = [
  'happy',
  'sad',
  'angry',
  'surprised',
  'confused',
  'excited',
  'bored',
  'sleepy',
];

const OUTFITS: Exclude<OutfitId, null>[] = ['casual', 'sporty', 'formal', 'fantasy', 'horror'];

const ACCESSORIES: AccessoryId[] = [
  'sunglasses',
  'hat',
  'scarf',
  'earrings',
  'necklace',
  'backpack',
];

function makeConfig(overrides: Partial<CharacterConfig> = {}): CharacterConfig {
  return {
    characterId: 1,
    baseColor: '#FF5733',
    expression: 'happy',
    outfit: null,
    accessories: [],
    background: 'city',
    ...overrides,
  };
}

describe('CharacterFigure', () => {
  it('renders without crashing with the default size', async () => {
    const { getByTestId, toJSON } = await render(<CharacterFigure config={makeConfig()} />);
    expect(toJSON()).toBeTruthy();
    expect(getByTestId('character-figure').props.width).toBe(240);
  });

  it('honors a custom size', async () => {
    const { getByTestId } = await render(<CharacterFigure config={makeConfig()} size={120} />);
    expect(getByTestId('character-figure').props.width).toBe(120);
  });

  it.each(EXPRESSIONS)('renders the %s expression without crashing', async (expression) => {
    const { getByTestId, toJSON } = await render(
      <CharacterFigure config={makeConfig({ expression })} />,
    );
    expect(toJSON()).toBeTruthy();
    expect(getByTestId(`expression-${expression}`)).toBeTruthy();
  });

  it.each(OUTFITS)('renders the %s outfit without crashing', async (outfit) => {
    const { getByTestId, toJSON } = await render(
      <CharacterFigure config={makeConfig({ outfit })} />,
    );
    expect(toJSON()).toBeTruthy();
    expect(getByTestId(`outfit-${outfit}`)).toBeTruthy();
  });

  it.each(ACCESSORIES)('renders the %s accessory alone without crashing', async (accessory) => {
    const { getByTestId, toJSON } = await render(
      <CharacterFigure config={makeConfig({ accessories: [accessory] })} />,
    );
    expect(toJSON()).toBeTruthy();
    expect(getByTestId(`accessory-${accessory}`)).toBeTruthy();
  });

  it('renders several accessories combined and keeps them all visible', async () => {
    const { getByTestId, toJSON } = await render(
      <CharacterFigure
        config={makeConfig({ accessories: ['sunglasses', 'hat', 'scarf', 'backpack'] })}
      />,
    );
    expect(toJSON()).toBeTruthy();
    expect(getByTestId('accessory-sunglasses')).toBeTruthy();
    expect(getByTestId('accessory-hat')).toBeTruthy();
    expect(getByTestId('accessory-scarf')).toBeTruthy();
    expect(getByTestId('accessory-backpack')).toBeTruthy();
  });

  it('changes the output tree when the expression changes', async () => {
    const happy = await render(<CharacterFigure config={makeConfig({ expression: 'happy' })} />);
    const sad = await render(<CharacterFigure config={makeConfig({ expression: 'sad' })} />);
    const happyTree = JSON.stringify(happy.toJSON());
    const sadTree = JSON.stringify(sad.toJSON());
    expect(happyTree).not.toBe(sadTree);
    expect(() => happy.getByTestId('expression-sad')).toThrow();
    expect(sad.getByTestId('expression-sad')).toBeTruthy();
  });

  it('changes the output tree when the outfit, accessories, color, or background change', async () => {
    const plain = JSON.stringify((await render(<CharacterFigure config={makeConfig()} />)).toJSON());
    const withOutfit = JSON.stringify(
      (await render(<CharacterFigure config={makeConfig({ outfit: 'horror' })} />)).toJSON(),
    );
    const withAccessory = JSON.stringify(
      (await render(<CharacterFigure config={makeConfig({ accessories: ['hat'] })} />)).toJSON(),
    );
    const recolored = JSON.stringify(
      (await render(<CharacterFigure config={makeConfig({ baseColor: '#3357FF' })} />)).toJSON(),
    );
    const newBackground = JSON.stringify(
      (await render(<CharacterFigure config={makeConfig({ background: 'space' })} />)).toJSON(),
    );
    expect(withOutfit).not.toBe(plain);
    expect(withAccessory).not.toBe(plain);
    expect(recolored).not.toBe(plain);
    expect(newBackground).not.toBe(plain);
  });
});
