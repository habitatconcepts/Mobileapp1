import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BackgroundId } from '../types/character';
import { backgrounds } from '../constants/backgrounds';

interface BackgroundPickerProps {
  selectedBackground: BackgroundId;
  onSelect: (background: BackgroundId) => void;
}

const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ selectedBackground, onSelect }) => {
  return (
    <View testID="background-picker" style={styles.container}>
      <View style={styles.row}>
        {backgrounds.map((background) => {
          const selected = background.id === selectedBackground;
          return (
            <TouchableOpacity
              key={background.id}
              testID={`background-${background.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Background ${background.name}`}
              accessibilityState={{ selected }}
              style={[styles.item, selected && styles.selectedItem]}
              onPress={() => onSelect(background.id)}
            >
              <Image source={background.image} style={styles.thumbnail} resizeMode="cover" />
              <Text style={[styles.name, selected && styles.selectedName]}>{background.name}</Text>
            </TouchableOpacity>
          );
        })}
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
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  selectedItem: {
    borderColor: '#FF6F61',
  },
  thumbnail: {
    width: '100%',
    height: 90,
  },
  name: {
    textAlign: 'center',
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  selectedName: {
    color: '#FF6F61',
  },
});

export default BackgroundPicker;
