import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CharacterSelect from './character-select';
import Customizer from './customizer';
import Gallery from './gallery';
import Profile from './profile';
import { CharacterProvider } from '../context/CharacterContext';
import { GalleryProvider } from '../context/GalleryContext';
import type { RootStackParamList, ScreenProps } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

function HeaderLink({
  navigation,
  target,
  label,
}: {
  navigation: ScreenProps['navigation'];
  target: 'Gallery' | 'Profile';
  label: string;
}): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => navigation.navigate(target)}
      style={styles.headerLink}
    >
      <Text style={styles.headerLinkText}>{label}</Text>
    </Pressable>
  );
}

/**
 * App shell: providers wrap the navigator exactly once.
 * GalleryProvider sits inside CharacterProvider because loading a saved
 * character into the customizer writes through the customizer context.
 */
const Layout = (): React.ReactElement => {
  return (
    <CharacterProvider>
      <GalleryProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="CharacterSelect"
            screenOptions={{ headerTitleStyle: styles.headerTitle }}
          >
            <Stack.Screen
              name="CharacterSelect"
              component={CharacterSelect}
              options={({ navigation }: ScreenProps<'CharacterSelect'>) => ({
                title: 'Choose your Sprunki',
                headerRight: () => (
                  <HeaderLink navigation={navigation} target="Gallery" label="Gallery" />
                ),
              })}
            />
            <Stack.Screen
              name="Customizer"
              component={Customizer}
              options={({ navigation }: ScreenProps<'Customizer'>) => ({
                title: 'Customize',
                headerRight: () => (
                  <HeaderLink navigation={navigation} target="Profile" label="Profile" />
                ),
              })}
            />
            <Stack.Screen
              name="Gallery"
              component={Gallery}
              options={({ navigation }: ScreenProps<'Gallery'>) => ({
                title: 'My Gallery',
                headerRight: () => (
                  <HeaderLink navigation={navigation} target="Profile" label="Profile" />
                ),
              })}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ title: 'Profile' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GalleryProvider>
    </CharacterProvider>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: '700',
  },
  headerLink: {
    marginRight: 12,
    padding: 6,
  },
  headerLinkText: {
    color: '#FF6F61',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Layout;
