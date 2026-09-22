import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SaveButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      testID="save-button"
      accessibilityRole="button"
      accessibilityLabel="Save to gallery"
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>Save to Gallery</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5CB85C',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default SaveButton;
