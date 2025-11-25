import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const PlayerDetailsScreen = ({ navigation, route }) => {
  const { player } = route.params;

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <Feather name={icon} size={20} color={COLORS.primary} />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image 
            source={{ uri: player.strThumb || 'https://via.placeholder.com/300' }} 
            style={styles.playerImage}
          />
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.playerHeader}>
            {player.strNumber && (
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>#{player.strNumber}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.nameContainer}>
            <Text style={styles.playerName}>{player.strPlayer}</Text>
            <Text style={styles.playerTeam}>{player.strTeam}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Information</Text>
            
            {player.strPosition && (
              <InfoRow 
                icon="target" 
                label="Position" 
                value={player.strPosition} 
              />
            )}
            
            {player.strNationality && (
              <InfoRow 
                icon="flag" 
                label="Nationality" 
                value={player.strNationality} 
              />
            )}
            
            {player.dateBorn && (
              <>
                <InfoRow 
                  icon="calendar" 
                  label="Date of Birth" 
                  value={new Date(player.dateBorn).toLocaleDateString()} 
                />
                <InfoRow 
                  icon="user" 
                  label="Age" 
                  value={`${calculateAge(player.dateBorn)} years`} 
                />
              </>
            )}
            
            {player.strNumber && (
              <InfoRow 
                icon="hash" 
                label="Jersey Number" 
                value={player.strNumber} 
              />
            )}
          </View>

          {player.strDescriptionEN && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{player.strDescriptionEN}</Text>
            </View>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Feather name="activity" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statBox}>
              <Feather name="target" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            <View style={styles.statBox}>
              <Feather name="trending-up" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Assists</Text>
            </View>
          </View>
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
  header: {
    height: 400,
    position: 'relative',
  },
  playerImage: {
    width: width,
    height: 400,
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
  playerHeader: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
  },
  numberBadge: {
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  numberText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    padding: SPACING.lg,
  },
  nameContainer: {
    marginBottom: SPACING.lg,
  },
  playerName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  playerTeam: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
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
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  statBox: {
    backgroundColor: COLORS.white,
    flex: 1,
    marginHorizontal: 4,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});

export default PlayerDetailsScreen;
