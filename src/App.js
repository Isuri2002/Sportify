import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import store from './redux/store';
import { ThemeProvider } from './contexts/ThemeContext';

console.log('Initializing App component...');

export default function App() {
  console.log('Rendering App component...');
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}

console.log('App component initialized successfully.');
