import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { GalleryContext } from '../context/GalleryContext';
import GalleryGrid from '../components/GalleryGrid';

const Gallery = () => {
  const { galleryItems } = useContext(GalleryContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character Gallery</Text>
      <FlatList
        data={galleryItems}
        renderItem={({ item }) => <GalleryGrid item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Gallery;