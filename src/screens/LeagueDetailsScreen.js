import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { fetchLeagueDetails } from '../services/api';

const LeagueDetailsScreen = ({ navigation, route }) => {
  const { leagueId } = route.params;
  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeague();
  }, [leagueId]);

  const loadLeague = async () => {
    setLoading(true);
    try {
      const { league, teams } = await fetchLeagueDetails(leagueId);
      setLeague(league);
      setTeams(teams);
    } catch (err) {
      setLeague(null);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading league...</Text>
      </View>
    );
  }

  if (!league) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={48} color={COLORS.textLight} />
        <Text style={styles.loadingText}>League not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: league.strBadge || 'https://via.placeholder.com/120' }}
          style={styles.leagueBadge}
        />
        <Text style={styles.leagueName}>{league.strLeague}</Text>
        <Text style={styles.country}>{league.strCountry}</Text>
        <Text style={styles.sport}>{league.strSport}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{league.strDescriptionEN || 'No description available.'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teams</Text>
        {teams.length === 0 ? (
          <Text style={styles.emptyText}>No teams found.</Text>
        ) : (
          teams.map((team) => (
            <TouchableOpacity
              key={team.idTeam}
              style={styles.teamRow}
              onPress={() => navigation.navigate('TeamDetails', { teamId: team.idTeam })}
            >
              <Image
                source={{ uri: team.strTeamBadge || 'https://via.placeholder.com/60' }}
                style={styles.teamLogo}
              />
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{team.strTeam}</Text>
                <Text style={styles.teamCountry}>{team.strCountry}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leagueBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.border,
  },
  leagueName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  country: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  sport: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    margin: SPACING.md,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  teamCountry: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
});

export default LeagueDetailsScreen;
