import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Customization } from '../types/customization';

interface CharacterCardProps {
  characterName: string;
  characterImage: string;
  customization: Customization;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ characterName, characterImage, customization }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: characterImage }} style={styles.image} />
      <Text style={styles.name}>{characterName}</Text>
      {/* Additional customization options can be displayed here */}
      <View style={styles.customizationContainer}>
        {/* Render customization options based on the customization prop */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  customizationContainer: {
    // Styles for customization options
  },
});

export default CharacterCard;