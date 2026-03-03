import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const backgrounds = [
  { id: 1, name: 'Forest', image: require('../../assets/backgrounds/forest.png') },
  { id: 2, name: 'Desert', image: require('../../assets/backgrounds/desert.png') },
  { id: 3, name: 'City', image: require('../../assets/backgrounds/city.png') },
  { id: 4, name: 'Space', image: require('../../assets/backgrounds/space.png') },
];

const BackgroundPicker = ({ selectedBackground, onSelectBackground }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Background</Text>
      <View style={styles.backgroundList}>
        {backgrounds.map((background) => (
          <TouchableOpacity
            key={background.id}
            style={[
              styles.backgroundItem,
              selectedBackground === background.id && styles.selectedBackground,
            ]}
            onPress={() => onSelectBackground(background.id)}
          >
            <Image source={background.image} style={styles.backgroundImage} />
            <Text style={styles.backgroundName}>{background.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 12,
  },
  backgroundList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  backgroundItem: {
    width: '45%',
    margin: '2.5%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedBackground: {
    borderColor: '#007BFF',
  },
  backgroundImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  backgroundName: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default BackgroundPicker;