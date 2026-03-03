export interface Character {
  id: string;
  name: string;
  outfit: string;
  accessories: string[];
  color: string;
  expression: string;
  background: string;
}

export interface CharacterData {
  characters: Character[];
}