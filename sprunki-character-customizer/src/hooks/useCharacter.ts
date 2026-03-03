import { useState, useEffect } from 'react';
import { Character } from '../types/character';
import { getCharacters } from '../constants/characters';

const useCharacter = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            const characterData = await getCharacters();
            setCharacters(characterData);
        };

        fetchCharacters();
    }, []);

    const selectCharacter = (character: Character) => {
        setSelectedCharacter(character);
    };

    const clearSelection = () => {
        setSelectedCharacter(null);
    };

    return {
        characters,
        selectedCharacter,
        selectCharacter,
        clearSelection,
    };
};

export default useCharacter;