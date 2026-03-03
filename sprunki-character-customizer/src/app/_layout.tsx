import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CharacterSelect from './character-select';
import Customizer from './customizer';
import Gallery from './gallery';
import Profile from './profile';
import { CharacterProvider } from '../context/CharacterContext';
import { GalleryProvider } from '../context/GalleryContext';

const Stack = createStackNavigator();

const Layout = () => {
  return (
    <CharacterProvider>
      <GalleryProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="CharacterSelect">
            <Stack.Screen name="CharacterSelect" component={CharacterSelect} />
            <Stack.Screen name="Customizer" component={Customizer} />
            <Stack.Screen name="Gallery" component={Gallery} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </GalleryProvider>
    </CharacterProvider>
  );
};

export default Layout;