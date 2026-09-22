import type { AccessoryId } from '../types/character';

export interface AccessoryDef {
  id: AccessoryId;
  name: string;
}

// Accessories are drawn procedurally by CharacterFigure — no image assets.
export const accessories: AccessoryDef[] = [
  { id: 'sunglasses', name: 'Sunglasses' },
  { id: 'hat', name: 'Hat' },
  { id: 'scarf', name: 'Scarf' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'necklace', name: 'Necklace' },
  { id: 'backpack', name: 'Backpack' },
];
