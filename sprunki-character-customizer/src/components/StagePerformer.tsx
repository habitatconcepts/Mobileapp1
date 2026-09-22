import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import type { CharacterConfig } from '../types/character';
import { BEAT_SECONDS } from '../audio/synth';
import CharacterFigure from './CharacterFigure';

interface StagePerformerProps {
  config: CharacterConfig;
  size?: number;
  /** When true the character dances on the beat; when false it stands still. */
  performing: boolean;
  /** Stagger offset in beats so a group doesn't bounce in perfect unison. */
  beatOffset?: number;
  testID?: string;
}

/**
 * Wraps the character figure in a beat-synced dance loop: a quick hop and
 * squash-and-stretch on every beat at the synth's tempo. Uses the core
 * Animated API so it works identically on native and web.
 */
const StagePerformer: React.FC<StagePerformerProps> = ({
  config,
  size = 240,
  performing,
  beatOffset = 0,
  testID,
}) => {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!performing) {
      bounce.setValue(0);
      return undefined;
    }
    const beatMs = BEAT_SECONDS * 1000;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: beatMs * 0.28,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: beatMs * 0.72,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    const startDelay = Math.round(((beatOffset % 1) + 1) % 1 * beatMs);
    const timer = setTimeout(() => loop.start(), startDelay);
    return (): void => {
      clearTimeout(timer);
      loop.stop();
      bounce.setValue(0);
    };
  }, [performing, beatOffset, bounce]);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const scale = bounce.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  const squash = bounce.interpolate({ inputRange: [0, 1], outputRange: [1, 0.94] });

  return (
    <Animated.View
      testID={testID}
      style={{ transform: [{ translateY }, { scale }, { scaleY: squash }] }}
    >
      <CharacterFigure config={config} size={size} />
    </Animated.View>
  );
};

export default StagePerformer;
