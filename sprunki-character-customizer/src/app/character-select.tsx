import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { characters } from '../constants/characters';
import { useCharacter } from '../hooks/useCharacter';

const CharacterSelect = () => {
  const { selectCharacter } = useCharacter();

  const renderCharacterItem = ({ item }) => (
    <TouchableOpacity onPress={() => selectCharacter(item)}>
      <View style={{ padding: 20, margin: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
        <Text style={{ fontSize: 18 }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Select Your Sprunki Character</Text>
      <FlatList
        data={characters}
        renderItem={renderCharacterItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default CharacterSelect;