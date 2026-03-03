export interface CustomizationOptions {
  outfit: string;
  accessories: string[];
  color: string;
  expression: string;
  background: string;
}

export interface CharacterCustomization {
  characterId: string;
  customization: CustomizationOptions;
}