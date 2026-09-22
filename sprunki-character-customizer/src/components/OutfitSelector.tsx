import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { OutfitId } from '../types/character';
import { outfits } from '../constants/outfits';

interface OutfitSelectorProps {
  selectedOutfit: OutfitId;
  onSelect: (outfit: OutfitId) => void;
}

const OutfitSelector: React.FC<OutfitSelectorProps> = ({ selectedOutfit, onSelect }) => {
  return (
    <View testID="outfit-selector" style={styles.container}>
      <View style={styles.row}>
        {outfits.map((outfit) => {
          const selected = outfit.id === selectedOutfit;
          return (
            <TouchableOpacity
              key={outfit.id}
              testID={`outfit-${outfit.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Outfit ${outfit.name}`}
              accessibilityState={{ selected }}
              style={[styles.card, selected && styles.selectedCard]}
              onPress={() => onSelect(outfit.id)}
            >
              <Text style={[styles.name, selected && styles.selectedText]}>{outfit.name}</Text>
              <Text style={[styles.description, selected && styles.selectedText]} numberOfLines={2}>
                {outfit.description}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          testID="outfit-none"
          accessibilityRole="button"
          accessibilityLabel="No outfit"
          accessibilityState={{ selected: selectedOutfit === null }}
          style={[styles.card, selectedOutfit === null && styles.selectedCard]}
          onPress={() => onSelect(null)}
        >
          <Text style={[styles.name, selectedOutfit === null && styles.selectedText]}>None</Text>
          <Text
            style={[styles.description, selectedOutfit === null && styles.selectedText]}
            numberOfLines={2}
          >
            Just the character, no outfit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '47%',
    margin: '1.5%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    backgroundColor: '#FF6F61',
    borderColor: '#FF6F61',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 16,
  },
  selectedText: {
    color: '#FFFFFF',
  },
});

export default OutfitSelector;
