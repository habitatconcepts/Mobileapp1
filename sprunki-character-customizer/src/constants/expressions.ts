import type { ExpressionId } from '../types/character';

export interface ExpressionDef {
  id: ExpressionId;
  name: string;
}

// Faces are drawn procedurally by CharacterFigure — no image assets.
export const expressions: ExpressionDef[] = [
  { id: 'happy', name: 'Happy' },
  { id: 'sad', name: 'Sad' },
  { id: 'angry', name: 'Angry' },
  { id: 'surprised', name: 'Surprised' },
  { id: 'confused', name: 'Confused' },
  { id: 'excited', name: 'Excited' },
  { id: 'bored', name: 'Bored' },
  { id: 'sleepy', name: 'Sleepy' },
];
