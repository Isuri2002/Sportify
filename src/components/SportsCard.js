import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../styles/theme";

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.border,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  favoriteButton: {
    marginLeft: "auto",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  scoreRow: {
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  scoreText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.success,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.border,
    alignSelf: "flex-start",
  },
  statusUpcoming: {
    backgroundColor: COLORS.primary,
  },
  statusLive: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: "600",
    color: COLORS.success,
  },
});

const SportsCard = ({ event, isFavorite, onPress, onToggleFavorite }) => {
  const hasScores = event.intHomeScore !== null && event.intAwayScore !== null;
  const isLive = event.strStatus === "Live";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{
          uri: event.strThumb || "https://via.placeholder.com/400x200",
        }}
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
              color={isFavorite ? COLORS.primary : COLORS.textLight}
              fill={isFavorite ? COLORS.primary : "none"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Feather name="flag" size={14} color={COLORS.textLight} />
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
        {/* Player clickable area */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Players: </Text>
          <TouchableOpacity onPress={() => onPlayerPress(event.strHomePlayer)}>
            <Text
              style={[
                styles.infoText,
                { textDecorationLine: "underline", color: COLORS.primary },
              ]}
            >
              {" "}
              {event.strHomePlayer}{" "}
            </Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>vs</Text>
          <TouchableOpacity onPress={() => onPlayerPress(event.strAwayPlayer)}>
            <Text
              style={[
                styles.infoText,
                { textDecorationLine: "underline", color: COLORS.primary },
              ]}
            >
              {" "}
              {event.strAwayPlayer}{" "}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={14} color={COLORS.textLight} />
            <Text style={styles.infoText}>{event.dateEvent}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              event.strStatus === "Not Started" && styles.statusUpcoming,
              isLive && styles.statusLive,
            ]}
          >
            <Text
              style={[styles.statusText, isLive && { color: COLORS.primary }]}
            >
              {event.strStatus || "Upcoming"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  // ...existing code...
  // The function definition is already above, so remove this duplicate line.
};

export default SportsCard;
