import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ShareButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      testID="share-button"
      accessibilityRole="button"
      accessibilityLabel="Share character"
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>Share</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6F61',
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

export default ShareButton;
