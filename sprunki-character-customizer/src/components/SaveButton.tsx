import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SaveButtonProps {
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onSave}>
      <Text style={styles.buttonText}>Save Character</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SaveButton;