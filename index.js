import { registerRootComponent } from 'expo';

import App from './src/App';

// Debugging logs to trace the error
console.log('Registering root component...');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

console.log('Root component registered successfully.');
