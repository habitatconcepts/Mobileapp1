import { registerRootComponent } from 'expo';
import App from './src/app/index';

// Entry point: single root component registration. All providers and the
// navigator are composed inside src/app/_layout.tsx.
registerRootComponent(App);
