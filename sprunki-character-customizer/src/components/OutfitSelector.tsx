import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { outfits } from '../constants/outfits';

interface OutfitSelectorProps {
  selectedOutfit: string;
  onSelectOutfit: (outfit: string) => void;
}

const OutfitSelector: React.FC<OutfitSelectorProps> = ({ selectedOutfit, onSelectOutfit }) => {
  const renderOutfitItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.outfitItem, selectedOutfit === item && styles.selectedOutfit]}
      onPress={() => onSelectOutfit(item)}
    >
      <Text style={styles.outfitText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Outfit</Text>
      <FlatList
        data={outfits}
        renderItem={renderOutfitItem}
        keyExtractor={(item) => item}
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  outfitItem: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedOutfit: {
    borderColor: '#007BFF',
    backgroundColor: '#E7F3FF',
  },
  outfitText: {
    fontSize: 16,
  },
});

export default OutfitSelector;