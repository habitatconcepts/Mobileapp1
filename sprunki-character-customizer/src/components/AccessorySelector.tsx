import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AccessoryId } from '../types/character';
import { accessories } from '../constants/accessories';

interface AccessorySelectorProps {
  /** Currently worn accessories. */
  selectedAccessories: AccessoryId[];
  onToggle: (accessory: AccessoryId) => void;
}

/**
 * Multi-toggle accessory picker. There is no separate hat concept —
 * hats live in the accessories list, so this is the only accessory UI.
 */
const AccessorySelector: React.FC<AccessorySelectorProps> = ({ selectedAccessories, onToggle }) => {
  return (
    <View testID="accessory-selector" style={styles.container}>
      <View style={styles.row}>
        {accessories.map((accessory) => {
          const selected = selectedAccessories.indexOf(accessory.id) !== -1;
          return (
            <TouchableOpacity
              key={accessory.id}
              testID={`accessory-${accessory.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Accessory ${accessory.name}`}
              accessibilityState={{ selected }}
              style={[styles.chip, selected && styles.selectedChip]}
              onPress={() => onToggle(accessory.id)}
            >
              <Text style={[styles.chipText, selected && styles.selectedChipText]}>
                {selected ? '✓ ' : ''}{accessory.name}
              </Text>
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
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  selectedChip: {
    backgroundColor: '#6B5B95',
    borderColor: '#6B5B95',
  },
  chipText: {
    fontSize: 15,
    color: '#333333',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default AccessorySelector;
