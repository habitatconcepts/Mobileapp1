import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import type { CharacterConfig } from '../types/character';
import { backgrounds } from '../constants/backgrounds';
import CharacterFigure from './CharacterFigure';
import StagePerformer from './StagePerformer';

interface CharacterPreviewProps {
  config: CharacterConfig;
  /** Diameter of the circular preview area. */
  size?: number;
  testID?: string;
  /** When true the figure dances on the beat instead of standing still. */
  performing?: boolean;
}

/**
 * Renders the character figure over its selected background image.
 * Pure presentational — every change to `config` is reflected immediately.
 */
const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  config,
  size = 280,
  testID,
  performing = false,
}) => {
  const source = backgrounds.find((b) => b.id === config.background)?.image;
  const figureSize = Math.round(size * 0.72);

  return (
    <View testID={testID} style={[styles.frame, { width: size, height: size, borderRadius: size / 2 }]}>
      <ImageBackground
        source={source}
        style={styles.background}
        imageStyle={{ borderRadius: size / 2 }}
        resizeMode="cover"
      >
        <View style={styles.figureSlot}>
          {performing ? (
            <StagePerformer config={config} size={figureSize} performing testID="stage-performer" />
          ) : (
            <CharacterFigure config={config} size={figureSize} />
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  figureSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CharacterPreview;
