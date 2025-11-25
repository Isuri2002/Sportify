import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import SportsCard from '../components/SportsCard';
import { useTheme } from '../contexts/ThemeContext';
import { removeFavorite } from '../redux/favoritesSlice';
import { COLORS, DARK_COLORS, FONT_SIZES, SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';


const FavoritesScreen = ({ navigation }) => {
  const { items: favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? DARK_COLORS : COLORS;
  const tabBarHeight = useBottomTabBarHeight();

  const handleToggleFavorite = (eventId) => {
    dispatch(removeFavorite(eventId));
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Favorites</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>
          {favorites.length} {favorites.length === 1 ? 'match' : 'matches'}
        </Text>
      </View>
      <Feather name="heart" size={28} color={colors.primary} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { backgroundColor: colors.white }]}> 
        {renderHeader()} 
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idEvent}
        renderItem={({ item }) => (
          <SportsCard
            event={item}
            isFavorite={true}
            onPress={() => navigation.navigate('Details', { event: item })}
            onToggleFavorite={() => handleToggleFavorite(item.idEvent)}
            colors={colors}
          />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={60} color={colors.textLight} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>Start adding matches to your favorites!</Text>
            <TouchableOpacity 
              style={[styles.exploreButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={styles.exploreButtonText}>Explore Matches</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.small,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  listContent: {
    padding: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 3,
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
    ...SHADOWS.small,
  },
  exploreButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
