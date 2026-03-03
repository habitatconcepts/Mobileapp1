import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useCharacter } from '../hooks/useCharacter';
import { useCustomization } from '../hooks/useCustomization';

const CharacterPreview = () => {
    const { selectedCharacter } = useCharacter();
    const { outfit, accessories, expression, backgroundColor } = useCustomization();

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Image source={{ uri: selectedCharacter.image }} style={styles.characterImage} />
            <Text style={styles.characterName}>{selectedCharacter.name}</Text>
            <Text style={styles.outfitText}>Outfit: {outfit}</Text>
            <Text style={styles.accessoriesText}>Accessories: {accessories.join(', ')}</Text>
            <Text style={styles.expressionText}>Expression: {expression}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    characterImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    characterName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    outfitText: {
        fontSize: 18,
    },
    accessoriesText: {
        fontSize: 18,
    },
    expressionText: {
        fontSize: 18,
    },
});

export default CharacterPreview;