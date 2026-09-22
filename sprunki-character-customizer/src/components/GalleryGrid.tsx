import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text } from 'react-native';
import type { SavedCharacter } from '../context/GalleryContext';
import CharacterPreview from './CharacterPreview';

interface GalleryGridProps {
  items: SavedCharacter[];
  onSelect: (saved: SavedCharacter) => void;
  onDelete: (saved: SavedCharacter) => void;
}

const confirmDelete = (saved: SavedCharacter, onDelete: (saved: SavedCharacter) => void): void => {
  Alert.alert(
    'Delete saved character?',
    'This will remove it from your gallery. This cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(saved) },
    ],
  );
};

/**
 * Two-column grid of saved characters. Tap a tile to load it back into the
 * customizer; long-press (or the × badge) to delete with confirmation.
 */
const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onSelect, onDelete }) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.grid}
      renderItem={({ item }) => (
        <Pressable
          testID={`gallery-item-${item.id}`}
          accessibilityRole="button"
          accessibilityLabel="Saved character"
          style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
          onPress={() => onSelect(item)}
          onLongPress={() => confirmDelete(item, onDelete)}
        >
          <CharacterPreview config={item.config} size={150} />
          <Pressable
            testID={`gallery-delete-${item.id}`}
            accessibilityRole="button"
            accessibilityLabel="Delete saved character"
            style={styles.deleteBadge}
            onPress={() => confirmDelete(item, onDelete)}
          >
            <Text style={styles.deleteText}>×</Text>
          </Pressable>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 8,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pressed: {
    opacity: 0.75,
  },
  deleteBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D9534F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
});

export default GalleryGrid;
