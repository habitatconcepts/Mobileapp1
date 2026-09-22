import type { RefObject } from 'react';
import { Alert, Share, type View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import type { CharacterConfig } from '../types/character';
import { characters } from '../constants/characters';
import { expressions } from '../constants/expressions';
import { outfits } from '../constants/outfits';
import { accessories } from '../constants/accessories';
import { backgrounds } from '../constants/backgrounds';

const nameOf = (id: number): string => characters.find((c) => c.id === id)?.name ?? 'Sprunki';
const expressionName = (id: CharacterConfig['expression']): string =>
  expressions.find((e) => e.id === id)?.name ?? id;
const outfitName = (id: CharacterConfig['outfit']): string =>
  id == null ? 'None' : outfits.find((o) => o.id === id)?.name ?? id;
const accessoryNames = (ids: CharacterConfig['accessories']): string =>
  ids.length === 0
    ? 'None'
    : ids.map((a) => accessories.find((acc) => acc.id === a)?.name ?? a).join(', ');
const backgroundName = (id: CharacterConfig['background']): string =>
  backgrounds.find((b) => b.id === id)?.name ?? id;

export function describeCustomization(config: CharacterConfig): string {
  return (
    `My Sprunki character: ${nameOf(config.characterId)}\n` +
    `Expression: ${expressionName(config.expression)}\n` +
    `Outfit: ${outfitName(config.outfit)}\n` +
    `Accessories: ${accessoryNames(config.accessories)}\n` +
    `Background: ${backgroundName(config.background)}`
  );
}

export type ShareOutcome = 'image-shared' | 'text-shared' | 'unavailable';

/**
 * Share the customizer preview. Captures the preview view as a PNG with
 * react-native-view-shot and shares the image via expo-sharing. If capture
 * or image sharing is unavailable, falls back to React Native's Share with a
 * text summary. Never throws — always resolves with the outcome.
 */
export async function shareCharacterImage(
  previewRef: RefObject<View | null>,
  config: CharacterConfig,
): Promise<ShareOutcome> {
  try {
    if (previewRef.current == null) {
      throw new Error('preview not ready');
    }
    const uri = await captureRef(previewRef, { format: 'png', quality: 1, result: 'tmpfile' });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your Sprunki' });
      return 'image-shared';
    }
    throw new Error('sharing unavailable');
  } catch {
    try {
      await Share.share({ message: describeCustomization(config) });
      return 'text-shared';
    } catch {
      Alert.alert(
        'Sharing unavailable',
        'Could not share right now. Please try again later.',
      );
      return 'unavailable';
    }
  }
}
