/* eslint-disable @typescript-eslint/no-require-imports */
// Static require() of image paths is Metro's canonical static-asset pattern:
// Metro resolves these at bundle time, which is what allows bundling to
// include the PNGs. import() would break the static resolution, so the
// require calls here are intentional.
import type { ImageSourcePropType } from 'react-native';
import type { BackgroundId } from '../types/character';

export interface BackgroundDef {
  id: BackgroundId;
  name: string;
  image: ImageSourcePropType;
}

export const backgrounds: BackgroundDef[] = [
  { id: 'city', name: 'City', image: require('../../assets/backgrounds/city.png') },
  { id: 'desert', name: 'Desert', image: require('../../assets/backgrounds/desert.png') },
  // NOTE: assets/backgrounds/forest.png does not exist in the repo yet (being
  // added separately). Metro resolves static require() calls at bundle time,
  // so importing this entry before forest.png lands may fail the bundle.
  // The entry is kept intentionally per the art brief.
  { id: 'forest', name: 'Forest', image: require('../../assets/backgrounds/forest.png') },
  { id: 'space', name: 'Space', image: require('../../assets/backgrounds/space.png') },
];
