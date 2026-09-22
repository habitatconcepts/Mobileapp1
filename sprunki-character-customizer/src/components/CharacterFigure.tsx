import React from 'react';
import Svg from 'react-native-svg';
import type { CharacterConfig } from '../types/character';
import {
  BackAccessoryArt,
  BackgroundWash,
  BodyArt,
  FaceArt,
  FrontAccessoryArt,
  OutfitArt,
  ScarfAccessoryArt,
  TopperArt,
} from './characterArt';

export interface CharacterFigureProps {
  config: CharacterConfig;
  size?: number;
}

/**
 * Procedural vector renderer for a Sprunki character.
 * Replaces the missing PNG character art: body, faces, outfits and
 * accessories are all drawn with react-native-svg on a 240x240 canvas.
 *
 * Layer order (back to front): background wash, backpack, body, head topper,
 * outfit, scarf, face, then front accessories (necklace, earrings,
 * sunglasses, hat) so combined accessories all stay visible.
 */
export default function CharacterFigure({ config, size = 240 }: CharacterFigureProps): React.JSX.Element {
  const { characterId, baseColor, expression, outfit, accessories, background, phase } = config;
  const showScarf = accessories.indexOf('scarf') !== -1;

  return (
    <Svg width={size} height={size} viewBox="0 0 240 240" testID="character-figure">
      <BackgroundWash background={background} phase={phase} />
      {accessories.map((accessory) => (
        <BackAccessoryArt key={`back-${accessory}`} accessory={accessory} />
      ))}
      <BodyArt baseColor={baseColor} phase={phase} />
      <TopperArt characterId={characterId} baseColor={baseColor} />
      {outfit !== null && <OutfitArt outfit={outfit} />}
      {showScarf && <ScarfAccessoryArt />}
      <FaceArt expression={expression} baseColor={baseColor} phase={phase} />
      {accessories.map((accessory) => (
        <FrontAccessoryArt key={`front-${accessory}`} accessory={accessory} />
      ))}
    </Svg>
  );
}
