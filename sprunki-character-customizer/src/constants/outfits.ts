import type { OutfitId } from '../types/character';

export interface OutfitDef {
  id: Exclude<OutfitId, null>;
  name: string;
  description: string;
}

// Outfits are drawn procedurally by CharacterFigure — no image assets.
export const outfits: OutfitDef[] = [
  {
    id: 'casual',
    name: 'Casual',
    description: 'A comfortable and stylish casual outfit.',
  },
  {
    id: 'sporty',
    name: 'Sporty',
    description: 'A sporty look perfect for active characters.',
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'An elegant formal outfit for special occasions.',
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'A magical outfit for fantasy adventures.',
  },
  {
    id: 'horror',
    name: 'Horror',
    description: 'A spooky outfit for Halloween or horror themes.',
  },
];
