import React from 'react';
import { TouchableOpacity, Text, Share, StyleSheet } from 'react-native';

const ShareButton = ({ character }) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out my Sprunki character: ${character.name}!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onShare}>
      <Text style={styles.buttonText}>Share Character</Text>
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

export default ShareButton;