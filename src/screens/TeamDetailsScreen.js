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
import { fetchTeamDetails, fetchPlayersByTeam } from '../services/api';

const TeamDetailsScreen = ({ navigation, route }) => {
  const { teamId } = route.params;
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const teamData = await fetchTeamDetails(teamId);
      setTeam(teamData);
      if (teamData?.strTeam) {
        const squad = await fetchPlayersByTeam(teamData.strTeam);
        setPlayers(squad);
      }
    } catch (err) {
      setTeam(null);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading team...</Text>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={48} color={COLORS.textLight} />
        <Text style={styles.loadingText}>Team not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: team.strTeamBadge || 'https://via.placeholder.com/120' }}
          style={styles.teamBadge}
        />
        <Text style={styles.teamName}>{team.strTeam}</Text>
        <Text style={styles.leagueName}>{team.strLeague}</Text>
        <Text style={styles.country}>{team.strCountry}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{team.strDescriptionEN || 'No description available.'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Squad</Text>
        {players.length === 0 ? (
          <Text style={styles.emptyText}>No player data available.</Text>
        ) : (
          players.map((player) => (
            <TouchableOpacity
              key={player.idPlayer}
              style={styles.playerRow}
              onPress={() => navigation.navigate('PlayerDetails', { player })}
            >
              <Image
                source={{ uri: player.strThumb || 'https://via.placeholder.com/60' }}
                style={styles.playerImage}
              />
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.strPlayer}</Text>
                <Text style={styles.playerPosition}>{player.strPosition || 'Player'}</Text>
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
  teamBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.border,
  },
  teamName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  leagueName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  country: {
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
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  playerPosition: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
});

export default TeamDetailsScreen;
