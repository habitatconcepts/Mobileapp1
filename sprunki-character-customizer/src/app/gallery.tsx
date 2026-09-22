import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGallery } from '../context/GalleryContext';
import GalleryGrid from '../components/GalleryGrid';
import type { ScreenProps } from '../types/navigation';

type Props = ScreenProps<'Gallery'>;

const Gallery = ({ navigation }: Props): React.ReactElement => {
  const { saved, loadIntoCustomizer, removeFromGallery } = useGallery();

  if (saved.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No saved characters yet</Text>
        <Text style={styles.emptyText}>
          Customize a character and tap "Save to Gallery" to see it here.
        </Text>
        <TouchableOpacity
          testID="gallery-empty-customize"
          accessibilityRole="button"
          style={styles.emptyButton}
          onPress={() => navigation.navigate('Customizer')}
        >
          <Text style={styles.emptyButtonText}>Customize a character</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GalleryGrid
        items={saved}
        onSelect={(entry) => {
          loadIntoCustomizer(entry);
          navigation.navigate('Customizer');
        }}
        onDelete={(entry) => removeFromGallery(entry.id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Gallery;
