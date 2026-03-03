import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selectedColor, onSelectColor }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Color:</Text>
      <View style={styles.colorContainer}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorBox, { backgroundColor: color }, selectedColor === color && styles.selected]}
            onPress={() => onSelectColor(color)}
          />
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
    marginBottom: 8,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorBox: {
    width: 50,
    height: 50,
    margin: 4,
    borderRadius: 4,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default ColorPicker;