// Canonical shared types for the Sprunki character customizer.
// The screens integrator consumes these exact shapes — do not change them
// without coordinating with the integrator.

export interface CharacterDef {
  id: number;
  name: string;
  description: string;
  baseColor: string;
}

export type ExpressionId =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'confused'
  | 'excited'
  | 'bored'
  | 'sleepy';

export type OutfitId = 'casual' | 'sporty' | 'formal' | 'fantasy' | 'horror' | null;

export type AccessoryId =
  | 'sunglasses'
  | 'hat'
  | 'scarf'
  | 'earrings'
  | 'necklace'
  | 'backpack';

export type BackgroundId = 'city' | 'desert' | 'forest' | 'space';

/** Sprunki phase: the character's normal look, or its corrupted horror form. */
export type Phase = 'normal' | 'horror';

export interface CharacterConfig {
  characterId: number;
  baseColor: string; // hex, defaults to the character's baseColor; user can recolor
  expression: ExpressionId;
  outfit: OutfitId; // null = no outfit
  accessories: AccessoryId[]; // multi-select, toggle
  background: BackgroundId;
  phase: Phase;
}
