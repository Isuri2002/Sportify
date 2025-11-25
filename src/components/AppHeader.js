import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const AppHeader = ({ username }) => (
  <View style={styles.header}>
    <Text style={styles.title}>Sport App</Text>
    {username && <Text style={styles.username}>Welcome, {username}</Text>}
  </View>
);

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default AppHeader;
