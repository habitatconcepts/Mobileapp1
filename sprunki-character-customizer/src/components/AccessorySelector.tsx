import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { accessories } from '../constants/accessories';

interface AccessorySelectorProps {
  selectedAccessory: string;
  onAccessorySelect: (accessory: string) => void;
}

const AccessorySelector: React.FC<AccessorySelectorProps> = ({ selectedAccessory, onAccessorySelect }) => {
  const renderAccessoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.accessoryItem, selectedAccessory === item && styles.selectedItem]}
      onPress={() => onAccessorySelect(item)}
    >
      <Text style={styles.accessoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Accessory</Text>
      <FlatList
        data={accessories}
        renderItem={renderAccessoryItem}
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
  accessoryItem: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedItem: {
    borderColor: '#007BFF',
    backgroundColor: '#E0F7FA',
  },
  accessoryText: {
    fontSize: 16,
  },
});

export default AccessorySelector;