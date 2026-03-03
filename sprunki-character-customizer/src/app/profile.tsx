import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CharacterContext } from '../context/CharacterContext';
import CharacterCard from '../components/CharacterCard';

const Profile = () => {
  const { savedCharacters } = useContext(CharacterContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <ScrollView>
        {savedCharacters.length > 0 ? (
          savedCharacters.map((character, index) => (
            <CharacterCard key={index} character={character} />
          ))
        ) : (
          <Text style={styles.noCharacters}>No saved characters found.</Text>
        )}
      </ScrollView>
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
  noCharacters: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default Profile;