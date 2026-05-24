import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

export interface Series {
  name: string;
  seriesId: string;
  logo: string;
  plot: string;
  genre: string;
  rating: string;
  year: string;
  type: string;
  numEpisodes: number;
}

interface SeriesCardProps {
  serie: Series;
  onPress: () => void;
}

export default function SeriesCard({ serie, onPress }: SeriesCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      {/* Poster */}
      <View style={styles.posterContainer}>
        {serie.logo ? (
          <Image source={{ uri: serie.logo }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.fallbackPoster]}>
            <Text style={styles.fallbackText}>{serie.name.charAt(0)}</Text>
          </View>
        )}

        {/* Episodes Badge */}
        {serie.numEpisodes > 0 && (
          <View style={styles.episodesBadge}>
            <Text style={styles.episodesText}>{serie.numEpisodes} EPS</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {serie.name}
        </Text>
        <Text style={styles.genre} numberOfLines={1}>
          {serie.genre || "TV Series"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    margin: SPACING.sm,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  posterContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  poster: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  fallbackPoster: {
    backgroundColor: "#7a5cff",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  episodesBadge: {
    position: "absolute",
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  episodesText: {
    color: "#fff",
    fontSize: FONTS.tiny,
    fontWeight: "bold",
  },
  info: {
    padding: SPACING.md,
  },
  name: {
    color: COLORS.text,
    fontSize: FONTS.small,
    fontWeight: "600",
    marginBottom: 2,
  },
  genre: {
    color: COLORS.textSecondary,
    fontSize: FONTS.tiny,
  },
});
