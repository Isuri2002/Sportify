import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ isDarkMode }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Favorites') {
          iconName = 'heart';
        } else if (route.name === 'Profile') {
          iconName = 'user';
        }
        return <Feather name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: isDarkMode ? '#fff' : 'tomato',
      tabBarInactiveTintColor: isDarkMode ? '#ccc' : 'gray',
      tabBarStyle: {
        backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isDarkMode } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={() => <BottomTabNavigator isDarkMode={isDarkMode} />} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
