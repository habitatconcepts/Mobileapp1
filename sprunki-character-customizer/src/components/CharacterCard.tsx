import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CharacterDef } from '../types/character';
import CharacterPreview from './CharacterPreview';

interface CharacterCardProps {
  character: CharacterDef;
  onPress: () => void;
}

/** One tappable character tile for the CharacterSelect screen. */
const CharacterCard: React.FC<CharacterCardProps> = ({ character, onPress }) => {
  return (
    <Pressable
      testID={`character-card-${character.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Select ${character.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <CharacterPreview
        config={{
          characterId: character.id,
          baseColor: character.baseColor,
          expression: 'happy',
          outfit: null,
          accessories: [],
          background: 'city',
          phase: 'normal',
        }}
        size={120}
      />
      <View style={styles.textBlock}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {character.description}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pressed: {
    opacity: 0.75,
  },
  textBlock: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default CharacterCard;
