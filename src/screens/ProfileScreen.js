import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { logout } from '../redux/authSlice';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';

const ProfileScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useSelector(state => state.auth);
  const { items: favorites } = useSelector(state => state.favorites);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.replace('Login'); // Navigate to the Login screen
          },
        },
      ]
    );
  };

  const ProfileHeader = () => (
    <View style={[styles.header, isDarkMode && styles.headerDark]}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, isDarkMode && styles.avatarDark]}>
          <Feather name="user" size={50} color={isDarkMode ? COLORS.white : COLORS.primary} />
        </View>
      </View>
      <Text style={[styles.userName, isDarkMode && styles.textDark]}>
        {user?.firstName || user?.username || 'Guest User'}
      </Text>
      <Text style={[styles.userEmail, isDarkMode && styles.textSecondaryDark]}>
        {user?.email || 'guest@sportify.com'}
      </Text>
    </View>
  );

  const SettingsItem = ({ icon, title, subtitle, rightElement }) => (
    <View style={[styles.settingsItem, isDarkMode && styles.settingsItemDark]}>
      <View style={[styles.settingsIcon, isDarkMode && styles.settingsIconDark]}>
        <Feather name={icon} size={22} color={isDarkMode ? COLORS.white : COLORS.primary} />
      </View>
      <View style={styles.settingsContent}>
        <Text style={[styles.settingsTitle, isDarkMode && styles.textDark]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingsSubtitle, isDarkMode && styles.textSecondaryDark]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement}
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView>
        <ProfileHeader />

        {/* Favorites Section */}
        <View style={styles.section}>
          <SettingsItem
            icon="heart"
            title="Favorites"
            subtitle={`${favorites.length} items`}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Preferences</Text>
          <SettingsItem
            icon="moon"
            title="Dark Mode"
            subtitle={isDarkMode ? 'Enabled' : 'Disabled'}
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#D1D5DB', true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            }
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>About</Text>
          <SettingsItem icon="info" title="App Version" subtitle="1.0.0" />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, isDarkMode && styles.logoutButtonDark]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDark: {
    backgroundColor: '#2C2C2C',
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  section: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  settingsItemDark: {
    backgroundColor: '#1E1E1E',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingsIconDark: {
    backgroundColor: '#2C2C2C',
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingsSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    margin: SPACING.lg,
  },
  logoutButtonDark: {
    backgroundColor: '#1E1E1E',
  },
  logoutText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
});

export default ProfileScreen;