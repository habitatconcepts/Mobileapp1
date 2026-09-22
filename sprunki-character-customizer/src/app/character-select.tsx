import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { characters } from '../constants/characters';
import { useCustomizer } from '../context/CharacterContext';
import CharacterCard from '../components/CharacterCard';
import type { ScreenProps } from '../types/navigation';

type Props = ScreenProps<'CharacterSelect'>;

const CharacterSelect = ({ navigation }: Props): React.ReactElement => {
  const { setCharacter } = useCustomizer();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pick a character to start customizing</Text>
      <FlatList
        data={characters}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => {
              setCharacter(item.id);
              navigation.navigate('Customizer');
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingBottom: 16,
  },
});

export default CharacterSelect;
