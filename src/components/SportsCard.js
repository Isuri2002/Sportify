import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.border,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: colors.textLight,
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#E8F5E9',
  },
  statusUpcoming: {
    backgroundColor: '#FFF3E0',
  },
  statusLive: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: colors.success,
  },
  scoreRow: {
    marginVertical: SPACING.sm,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  scoreText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: colors.white,
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    marginRight: SPACING.xs,
  },
});

const SportsCard = ({ event, isFavorite, onPress, onToggleFavorite, colors }) => {
  const hasScores = event.intHomeScore !== null && event.intAwayScore !== null;
  const isLive = event.strStatus === 'Live';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: event.strThumb || 'https://via.placeholder.com/400x200' }} 
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {event.strEvent}
          </Text>
          <TouchableOpacity 
            onPress={onToggleFavorite}
            style={styles.favoriteButton}
          >
            <Feather
              name="heart"
              size={22}
              color={isFavorite ? colors.primary : colors.textLight}
              fill={isFavorite ? colors.primary : 'none'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Feather name="flag" size={14} color={colors.textLight} />
          <Text style={styles.infoText}>
            {event.strSport} • {event.strLeague}
          </Text>
        </View>
        {hasScores && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>
              {event.intHomeScore} - {event.intAwayScore}
            </Text>
          </View>
        )}
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={14} color={colors.textLight} />
            <Text style={styles.infoText}>{event.dateEvent}</Text>
          </View>
          <View style={[styles.statusBadge, event.strStatus === 'Not Started' && styles.statusUpcoming, isLive && styles.statusLive]}>
            <Text style={[styles.statusText, isLive && { color: colors.live }]}>{event.strStatus || 'Upcoming'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SportsCard;
