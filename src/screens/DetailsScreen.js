import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { addFavorite, removeFavorite } from '../redux/favoritesSlice';
import { COLORS, DARK_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import { fetchPlayersByTeam } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ navigation, route }) => {
  const { event } = route.params;
  const { items: favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? DARK_COLORS : COLORS;

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const isFavorite = favorites.some((fav) => fav.idEvent === event.idEvent);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    if (event.strHomeTeam && event.strAwayTeam) {
      setLoadingPlayers(true);
      try {
        const [homeTeamPlayers, awayTeamPlayers] = await Promise.all([
          fetchPlayersByTeam(event.strHomeTeam),
          fetchPlayersByTeam(event.strAwayTeam),
        ]);
        setHomePlayers(homeTeamPlayers);
        setAwayPlayers(awayTeamPlayers);
      } catch (error) {
        console.error('Error loading players:', error);
      } finally {
        setLoadingPlayers(false);
      }
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(event.idEvent));
    } else {
      dispatch(addFavorite(event));
    }
  };

  const handlePlayerPress = (player) => {
    navigation.navigate('PlayerDetails', { player });
  };

  const InfoRow = ({ icon, label, value, colors }) => (
    <View style={styles.infoRow}>
      <Feather name={icon} size={20} color={colors.primary} />
      <View style={styles.infoTextContainer}>
        <Text style={[styles.infoLabel, { color: colors.textLight }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );

  const PlayerCard = ({ player }) => (
    <TouchableOpacity 
      style={styles.playerCard}
      onPress={() => handlePlayerPress(player)}
    >
      <Image 
        source={{ uri: player.strThumb || 'https://via.placeholder.com/80' }} 
        style={styles.playerImage}
      />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.strPlayer}</Text>
        <Text style={styles.playerPosition}>{player.strPosition || 'Player'}</Text>
        {player.strNumber && (
          <View style={styles.playerNumber}>
            <Text style={styles.playerNumberText}>#{player.strNumber}</Text>
          </View>
        )}
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  const hasScores = event.intHomeScore !== null && event.intAwayScore !== null;
  const isLive = event.strStatus === 'Live';
  const isFinished = event.strStatus === 'FT' || event.strStatus === 'Finished';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Image 
          source={{ uri: event.strThumb || 'https://via.placeholder.com/400x250' }} 
          style={styles.image}
        />

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Match Title & Favorite */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
              {event.strEvent}
            </Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <Feather
                name="heart"
                size={28}
                color={isFavorite ? colors.primary : colors.textLight}
                fill={isFavorite ? colors.primary : 'none'}
              />
            </TouchableOpacity>
          </View>

          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              isLive && styles.statusLive,
              isFinished && styles.statusFinished,
            ]}>
              <Text style={[
                styles.statusText,
                isLive && styles.statusTextLive,
              ]}>
                {event.strStatus || 'Upcoming'}
              </Text>
            </View>
          </View>

          {/* Scores Section */}
          {hasScores && (event.strHomeTeam || event.strAwayTeam) && (
            <View style={[styles.scoreSection, { backgroundColor: colors.white }]}>
              <View style={styles.scoreContainer}>
                <View style={styles.teamScore}>
                  <Text style={[styles.teamNameLarge, { color: colors.text }]}>{event.strHomeTeam}</Text>
                  <Text style={styles.scoreText}>{event.intHomeScore}</Text>
                </View>
                <Text style={styles.scoreSeparator}>-</Text>
                <View style={styles.teamScore}>
                  <Text style={[styles.teamNameLarge, { color: colors.text }]}>{event.strAwayTeam}</Text>
                  <Text style={styles.scoreText}>{event.intAwayScore}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Tabs */}
          <View style={[styles.tabContainer, { backgroundColor: colors.white }]}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'details' && styles.activeTab]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
                Match Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'players' && styles.activeTab]}
              onPress={() => setActiveTab('players')}
            >
              <Text style={[styles.tabText, activeTab === 'players' && styles.activeTabText]}>
                Players
              </Text>
            </TouchableOpacity>
          </View>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <>
              <View style={[styles.section, { backgroundColor: colors.white }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Match Information</Text>
                
                <InfoRow 
                  icon="flag" 
                  label="Sport" 
                  value={event.strSport || 'N/A'} 
                  colors={colors}
                />
                <View style={styles.infoRow}>
                  <Feather name="award" size={20} color={colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: colors.textLight }]}>League</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (event.idLeague) {
                          navigation.navigate('LeagueDetails', { leagueId: event.idLeague });
                        }
                      }}
                    >
                      <Text style={[styles.infoValue, { textDecorationLine: 'underline', color: colors.primary }]}>
                        {event.strLeague || 'N/A'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <InfoRow 
                  icon="calendar" 
                  label="Date" 
                  value={event.dateEvent || 'TBA'} 
                  colors={colors}
                />
                {event.strTime && (
                  <InfoRow 
                    icon="clock" 
                    label="Time" 
                    value={event.strTime} 
                    colors={colors}
                  />
                )}
                <InfoRow 
                  icon="map-pin" 
                  label="Venue" 
                  value={event.strVenue || 'TBA'} 
                  colors={colors}
                />
              </View>

              {(event.strHomeTeam || event.strAwayTeam) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Teams</Text>
                  <View style={styles.teamsContainer}>
                    <View style={styles.team}>
                      <Text style={styles.teamLabel}>Home</Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (event.idHomeTeam) {
                            navigation.navigate('TeamDetails', { teamId: event.idHomeTeam });
                          }
                        }}
                      >
                        <Text style={[styles.teamName, { textDecorationLine: 'underline', color: COLORS.primary }]}>
                          {event.strHomeTeam}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.vs}>VS</Text>
                    <View style={styles.team}>
                      <Text style={styles.teamLabel}>Away</Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (event.idAwayTeam) {
                            navigation.navigate('TeamDetails', { teamId: event.idAwayTeam });
                          }
                        }}
                      >
                        <Text style={[styles.teamName, { textDecorationLine: 'underline', color: COLORS.primary }]}>
                          {event.strAwayTeam}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}

          {/* Players Tab */}
          {activeTab === 'players' && (
            <>
              {loadingPlayers ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>Loading players...</Text>
                </View>
              ) : (
                <>
                  {/* Home Team Players */}
                  {homePlayers.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        {event.strHomeTeam} Squad
                      </Text>
                      {homePlayers.map((player) => (
                        <PlayerCard key={player.idPlayer} player={player} />
                      ))}
                    </View>
                  )}

                  {/* Away Team Players */}
                  {awayPlayers.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        {event.strAwayTeam} Squad
                      </Text>
                      {awayPlayers.map((player) => (
                        <PlayerCard key={player.idPlayer} player={player} />
                      ))}
                    </View>
                  )}

                  {homePlayers.length === 0 && awayPlayers.length === 0 && (
                    <View style={styles.emptyContainer}>
                      <Feather name="users" size={50} color={COLORS.textLight} />
                      <Text style={styles.emptyText}>No player data available</Text>
                      <Text style={styles.emptySubtext}>
                        This may happen if team names don't match API records
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: width,
    height: 300,
    backgroundColor: COLORS.border,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.xl + 10,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.md,
  },
  favoriteButton: {
    padding: SPACING.sm,
  },
  statusContainer: {
    marginBottom: SPACING.lg,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#FFF3E0',
  },
  statusLive: {
    backgroundColor: '#FFEBEE',
  },
  statusFinished: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.warning,
  },
  statusTextLive: {
    color: COLORS.live,
  },
  scoreSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamNameLarge: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreSeparator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginHorizontal: SPACING.md,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.white,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  team: {
    alignItems: 'center',
    flex: 1,
  },
  teamLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  teamName: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  vs: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginHorizontal: SPACING.md,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.border,
  },
  playerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
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
  playerNumber: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  playerNumberText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    marginTop: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: SPACING.xs,
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});

export default DetailsScreen;
