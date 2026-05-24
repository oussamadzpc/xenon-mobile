import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

export interface Movie {
  name: string;
  url: string;
  logo: string;
  plot: string;
  genre: string;
  rating: string;
  year: string;
  type: string;
  streamId: string;
}

interface MovieCardProps {
  movie: Movie;
  isSelected: boolean;
  onPress: () => void;
}

export default function MovieCard({ movie, isSelected, onPress }: MovieCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, isSelected && styles.selected]}
    >
      {/* Poster */}
      <View style={styles.posterContainer}>
        {movie.logo ? (
          <Image source={{ uri: movie.logo }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.fallbackPoster]}>
            <Text style={styles.fallbackText}>{movie.name.charAt(0)}</Text>
          </View>
        )}

        {/* Year Badge */}
        {movie.year && (
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{movie.year}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {movie.name}
        </Text>
        <Text style={styles.genre} numberOfLines={1}>
          {movie.genre || "Movie"}
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
  selected: {
    borderColor: "#ff0055",
    backgroundColor: "rgba(255,0,85,0.1)",
    ...SHADOWS.medium,
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
    backgroundColor: "#ff0055",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  yearBadge: {
    position: "absolute",
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  yearText: {
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
