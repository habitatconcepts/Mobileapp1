import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CharacterContext } from '../context/CharacterContext';
import CharacterPreview from '../components/CharacterPreview';
import AccessorySelector from '../components/AccessorySelector';
import OutfitSelector from '../components/OutfitSelector';
import HatSelector from '../components/HatSelector';
import ExpressionSelector from '../components/ExpressionSelector';
import ColorPicker from '../components/ColorPicker';
import SaveButton from '../components/SaveButton';
import ShareButton from '../components/ShareButton';

const Customizer = () => {
    const { character, updateCharacter } = useContext(CharacterContext);

    const handleAccessoryChange = (accessory) => {
        updateCharacter({ ...character, accessory });
    };

    const handleOutfitChange = (outfit) => {
        updateCharacter({ ...character, outfit });
    };

    const handleHatChange = (hat) => {
        updateCharacter({ ...character, hat });
    };

    const handleExpressionChange = (expression) => {
        updateCharacter({ ...character, expression });
    };

    const handleColorChange = (color) => {
        updateCharacter({ ...character, color });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customize Your Sprunki</Text>
            <CharacterPreview character={character} />
            <AccessorySelector onChange={handleAccessoryChange} />
            <OutfitSelector onChange={handleOutfitChange} />
            <HatSelector onChange={handleHatChange} />
            <ExpressionSelector onChange={handleExpressionChange} />
            <ColorPicker onChange={handleColorChange} />
            <SaveButton />
            <ShareButton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Customizer;