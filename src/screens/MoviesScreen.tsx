import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import VideoPlayer from "../components/VideoPlayer";
import MovieCard, { Movie } from "../components/MovieCard";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

interface MoviesScreenProps {
  movies: Movie[];
  selectedMovie: Movie | null;
  onSelectMovie: (movie: Movie) => void;
}

export default function MoviesScreen({
  movies,
  selectedMovie,
  onSelectMovie,
}: MoviesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = searchQuery
    ? movies.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.genre && m.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : movies;

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <View>
          <Text style={styles.heroTitle}>🎬 MOVIES</Text>
          <Text style={styles.heroSubtitle}>On Demand • HD & 4K</Text>
        </View>
      </View>

      {/* Video Player */}
      {selectedMovie && <VideoPlayer streamUrl={selectedMovie.url} />}

      {/* Movie Info */}
      {selectedMovie && (
        <View style={styles.movieInfo}>
          <Text style={styles.movieName}>{selectedMovie.name}</Text>
          {selectedMovie.plot && (
            <Text style={styles.moviePlot} numberOfLines={3} ellipsizeMode="tail">
              {selectedMovie.plot}
            </Text>
          )}
        </View>
      )}

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Movies Grid */}
      <Text style={styles.sectionTitle}>
        🎬 Movies ({filteredMovies.length})
      </Text>

      <ScrollView>
        <View style={styles.moviesGrid}>
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie, idx) => (
              <MovieCard
                key={idx}
                movie={movie}
                isSelected={selectedMovie?.streamId === movie.streamId}
                onPress={() => onSelectMovie(movie)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "🔍 No movies match"
                  : movies.length === 0
                  ? "⏳ Loading..."
                  : "🎬 No movies available"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  hero: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xxl,
    backgroundColor: "rgba(255,0,128,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    fontSize: FONTS.header,
    fontWeight: "900",
    color: COLORS.text,
  },
  heroSubtitle: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  movieInfo: {
    padding: SPACING.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  movieName: {
    color: "#ff0055",
    fontSize: FONTS.medium,
    fontWeight: "bold",
    marginBottom: SPACING.sm,
  },
  moviePlot: {
    color: "rgba(255,255,255,0.7)",
    fontSize: FONTS.small,
  },
  searchInput: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(0,200,255,0.2)",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    color: "#fff",
    fontSize: FONTS.medium,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: "bold",
    marginBottom: SPACING.md,
  },
  moviesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyState: {
    padding: SPACING.xxxl,
    alignItems: "center",
    width: "100%",
  },
  emptyText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: FONTS.medium,
  },
});
