import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

export interface Episode {
  episode_num: string;
  title: string;
  url: string;
  season: string;
  duration: string;
  plot: string;
  streamId: string;
}

interface EpisodeCardProps {
  episode: Episode;
  isSelected: boolean;
  onPress: () => void;
}

export default function EpisodeCard({ episode, isSelected, onPress }: EpisodeCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, isSelected && styles.selected]}
    >
      {/* Episode Number */}
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{episode.episode_num || "?"}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {episode.title || `Episode ${episode.episode_num}`}
        </Text>
        {episode.duration && (
          <Text style={styles.duration}>{episode.duration}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selected: {
    borderColor: "#7a5cff",
    backgroundColor: "rgba(122,92,255,0.1)",
  },
  numberContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: "#7a5cff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  numberText: {
    color: "#fff",
    fontSize: FONTS.large,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: "600",
  },
  duration: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    marginTop: 2,
  },
});
