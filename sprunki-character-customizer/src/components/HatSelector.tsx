import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCustomization } from '../hooks/useCustomization';
import { hats } from '../constants/accessories';

const HatSelector = () => {
  const { selectedHat, setSelectedHat } = useCustomization();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Hat</Text>
      <View style={styles.hatList}>
        {hats.map((hat) => (
          <TouchableOpacity
            key={hat.id}
            style={[
              styles.hatItem,
              selectedHat === hat.id && styles.selectedHat,
            ]}
            onPress={() => setSelectedHat(hat.id)}
          >
            <Text style={styles.hatText}>{hat.name}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  hatList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hatItem: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedHat: {
    borderColor: '#007BFF',
    backgroundColor: '#E0F7FA',
  },
  hatText: {
    fontSize: 16,
  },
});

export default HatSelector;