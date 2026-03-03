import React from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { useGallery } from '../hooks/useGallery';

const GalleryGrid = () => {
    const { galleryItems } = useGallery();

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
        </View>
    );

    return (
        <FlatList
            data={galleryItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
        />
    );
};

const styles = StyleSheet.create({
    grid: {
        padding: 10,
    },
    itemContainer: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
});

export default GalleryGrid;