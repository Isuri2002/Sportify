import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import SportsCard from "../components/SportsCard";
import { useTheme } from "../contexts/ThemeContext";
import { logout } from "../redux/authSlice";
import { addFavorite, removeFavorite } from "../redux/favoritesSlice";
import { fetchAllEvents, searchEvents } from "../services/api";
import {
  COLORS,
  DARK_COLORS,
  FONT_SIZES,
  SHADOWS,
  SPACING,
} from "../styles/theme";

const HomeScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { items: favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? DARK_COLORS : COLORS;

  const tabBarHeight = useBottomTabBarHeight();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    loadEvents();
  }, []);

  // Search handler (debounced)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const q = searchQuery.trim();
      if (q.length >= 3) {
        setSearchLoading(true);
        try {
          const results = await searchEvents(q);
          setEvents(results);
        } catch (err) {
          console.error("Search error", err);
        } finally {
          setSearchLoading(false);
        }
      } else {
        loadEvents();
      }
    }, 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Use a default leagueId (e.g., English Premier League = 4328)
  const DEFAULT_LEAGUE_ID = "4328";
  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchAllEvents(DEFAULT_LEAGUE_ID);
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleToggleFavorite = (event) => {
    const isFav = favorites.some((fav) => fav.idEvent === event.idEvent);

    if (isFav) {
      dispatch(removeFavorite(event.idEvent));
    } else {
      dispatch(addFavorite(event));
    }
  };

  const isFavorite = (eventId) => {
    return favorites.some((fav) => fav.idEvent === eventId);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View>
        <Text style={[styles.greeting, { color: colors.textLight }]}>
          Welcome back,
        </Text>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.firstName || user?.username || "User"}
        </Text>
      </View>

      <View style={styles.headerIcons}>
        <Feather
          name="award"
          size={28}
          color={colors.primary}
          style={{ marginRight: SPACING.md }}
        />
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textLight }]}>
          Loading events...
        </Text>
      </View>
    );
  }

  const filteredEvents = events.filter((event) => {
    const q = searchQuery.toLowerCase();
    return (
      event.strEvent?.toLowerCase().includes(q) ||
      event.strHomeTeam?.toLowerCase().includes(q) ||
      event.strAwayTeam?.toLowerCase().includes(q)
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        {renderHeader()}
      </View>

      {/* Search Bar */}
      <View
        style={[styles.searchBarContainer, { backgroundColor: colors.white }]}
      >
        <Feather
          name="search"
          size={20}
          color={colors.textLight}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search matches or teams..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={searchLoading ? [] : filteredEvents}
        keyExtractor={(item) => item.idEvent}
        renderItem={({ item }) => (
          <SportsCard
            event={item}
            isFavorite={isFavorite(item.idEvent)}
            onPress={() => navigation.navigate("Details", { event: item })}
            onToggleFavorite={() => handleToggleFavorite(item)}
            onPlayerPress={(playerName) => {
              if (playerName) {
                navigation.navigate("PlayerDetails", { playerName });
              }
            }}
            colors={colors}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight },
        ]}
        ListHeaderComponent={
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            All Matches
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={60} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        }
      />

      {searchLoading && (
        <View style={styles.searchLoading}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.searchLoadingText}>Searching...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  header: {
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.small,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: FONT_SIZES.md,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    marginTop: SPACING.xs,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  listContent: {
    padding: SPACING.md,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    padding: 0,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    marginTop: SPACING.md,
  },
  searchLoading: {
    padding: SPACING.sm,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  searchLoadingText: {
    marginLeft: SPACING.sm,
  },
});

export default HomeScreen;
