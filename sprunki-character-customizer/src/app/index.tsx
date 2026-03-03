import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CharacterProvider } from '../context/CharacterContext';
import { GalleryProvider } from '../context/GalleryContext';
import Layout from './_layout';

const App = () => {
  return (
    <CharacterProvider>
      <GalleryProvider>
        <NavigationContainer>
          <Layout />
        </NavigationContainer>
      </GalleryProvider>
    </CharacterProvider>
  );
};

export default App;