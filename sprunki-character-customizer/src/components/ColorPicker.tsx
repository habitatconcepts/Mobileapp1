import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { characters } from '../constants/characters';

/**
 * Extra swatches beyond the characters' own base colors, so users have a
 * real palette to play with. The four character base colors always lead.
 */
const EXTRA_SWATCHES = [
  '#FF6F61',
  '#6B5B95',
  '#88B04B',
  '#F7CAC9',
  '#92A8D1',
  '#955251',
  '#B56576',
  '#6D597A',
  '#355070',
  '#E56B6F',
  '#EAAC8B',
  '#B8BEDD',
];

export const colorPalette = (): string[] => {
  const base = characters.map((c) => c.baseColor);
  const extras = EXTRA_SWATCHES.filter((c) => base.indexOf(c) === -1);
  return [...base, ...extras];
};

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  const palette = colorPalette();

  return (
    <View testID="color-picker" style={styles.container}>
      <View style={styles.swatchRow}>
        {palette.map((color) => {
          const selected = selectedColor.toLowerCase() === color.toLowerCase();
          return (
            <TouchableOpacity
              key={color}
              testID={`color-swatch-${color}`}
              accessibilityRole="button"
              accessibilityLabel={`Pick color ${color}`}
              accessibilityState={{ selected }}
              style={[
                styles.swatch,
                { backgroundColor: color },
                selected && styles.selectedSwatch,
              ]}
              onPress={() => onSelectColor(color)}
            />
          );
        })}
      </View>
      <View style={styles.currentRow}>
        <Text style={styles.currentLabel}>Current:</Text>
        <View testID="selected-color" style={[styles.currentSwatch, { backgroundColor: selectedColor }]} />
        <Text style={styles.currentHex}>{selectedColor}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    margin: 6,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  selectedSwatch: {
    borderWidth: 3,
    borderColor: '#333333',
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  currentLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  currentSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginRight: 8,
  },
  currentHex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});

export default ColorPicker;
