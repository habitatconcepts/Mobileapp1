import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

/**
 * Typed route map for the app's stack navigator.
 * Matches the @react-navigation v7 (native + stack) typing pattern:
 * the navigator is created with createStackNavigator<RootStackParamList>()
 * and screens receive StackNavigationProp / RouteProp helpers below.
 */
export type RootStackParamList = {
  CharacterSelect: undefined;
  Customizer: undefined;
  Gallery: undefined;
  Profile: undefined;
};

export type ScreenName = keyof RootStackParamList;

export type AppNavigationProp<T extends ScreenName = ScreenName> = StackNavigationProp<
  RootStackParamList,
  T
>;

export type AppRouteProp<T extends ScreenName = ScreenName> = RouteProp<RootStackParamList, T>;

export interface ScreenProps<T extends ScreenName = ScreenName> {
  navigation: AppNavigationProp<T>;
  route: AppRouteProp<T>;
}
