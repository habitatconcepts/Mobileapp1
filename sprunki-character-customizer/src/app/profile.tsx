import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCustomizer } from '../context/CharacterContext';
import { useGallery } from '../context/GalleryContext';

/** Mirrors the expo.version in app.json. */
const APP_VERSION = '1.0.0';

const Profile = (): React.ReactElement => {
  const { saved, customizationCount, clearGallery } = useGallery();
  const { reset } = useCustomizer();
  const [clearing, setClearing] = useState(false);

  const handleResetAll = (): void => {
    Alert.alert(
      'Reset all data?',
      'This clears your gallery and all saved counts. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            try {
              await clearGallery();
              reset();
              Alert.alert('Done', 'All saved data has been cleared.');
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>Sprunki Character Customizer</Text>
      <Text style={styles.tagline}>Design your own Sprunki, your way.</Text>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Characters customized</Text>
          <Text testID="profile-customization-count" style={styles.statValue}>
            {customizationCount}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Saved in gallery</Text>
          <Text testID="profile-gallery-count" style={styles.statValue}>
            {saved.length}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        testID="profile-reset-button"
        accessibilityRole="button"
        accessibilityLabel="Reset all data"
        style={[styles.resetButton, clearing && styles.disabled]}
        onPress={handleResetAll}
        disabled={clearing}
      >
        <Text style={styles.resetButtonText}>Reset all data</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version {APP_VERSION}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    padding: 20,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 15,
    color: '#777777',
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#555555',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6F61',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  resetButton: {
    backgroundColor: '#D9534F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: '#999999',
  },
});

export default Profile;
