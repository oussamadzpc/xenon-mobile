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
import SeriesCard, { Series } from "../components/SeriesCard";
import EpisodeCard, { Episode } from "../components/EpisodeCard";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

interface SeriesScreenProps {
  series: Series[];
  episodes: Episode[];
  selectedSeries: Series | null;
  selectedEpisode: Episode | null;
  onSelectSeries: (series: Series) => void;
  onSelectEpisode: (episode: Episode) => void;
  onBackToSeries: () => void;
  loadEpisodes: (series: Series) => void;
}

export default function SeriesScreen({
  series,
  episodes,
  selectedSeries,
  selectedEpisode,
  onSelectSeries,
  onSelectEpisode,
  onBackToSeries,
  loadEpisodes,
}: SeriesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSeries = searchQuery
    ? series.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.genre && s.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : series;

  const handleSelectSeries = (serie: Series) => {
    onSelectSeries(serie);
    loadEpisodes(serie);
  };

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <View>
          <Text style={styles.heroTitle}>📺 TV SERIES</Text>
          <Text style={styles.heroSubtitle}>Binge Watch • Full Seasons</Text>
        </View>
      </View>

      {/* Video Player */}
      {selectedEpisode && <VideoPlayer streamUrl={selectedEpisode.url} />}

      {/* Series List or Episodes */}
      {!selectedSeries ? (
        <>
          {/* Search */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search series..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <Text style={styles.sectionTitle}>
            📺 All Series ({filteredSeries.length})
          </Text>

          <ScrollView>
            <View style={styles.seriesGrid}>
              {filteredSeries.length > 0 ? (
                filteredSeries.map((s, idx) => (
                  <SeriesCard
                    key={idx}
                    serie={s}
                    onPress={() => handleSelectSeries(s)}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    {searchQuery
                      ? "🔍 No series match"
                      : series.length === 0
                      ? "⏳ Loading..."
                      : "📺 No series available"}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          {/* Episodes View */}
          <View style={styles.episodesHeader}>
            <Text style={styles.episodesTitle}>
              📺 {selectedSeries.name} - Episodes ({episodes.length})
            </Text>
            <TouchableOpacity onPress={onBackToSeries} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>

          {selectedSeries.plot && (
            <Text style={styles.plot} numberOfLines={3} ellipsizeMode="tail">
              {selectedSeries.plot}
            </Text>
          )}

          <ScrollView>
            <View style={styles.episodesList}>
              {episodes.length > 0 ? (
                episodes.map((ep, idx) => (
                  <EpisodeCard
                    key={idx}
                    episode={ep}
                    isSelected={selectedEpisode?.streamId === ep.streamId}
                    onPress={() => onSelectEpisode(ep)}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>⏳ Loading episodes...</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
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
    backgroundColor: "rgba(122,92,255,0.12)",
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
  seriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  episodesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  episodesTitle: {
    color: "#7a5cff",
    fontSize: FONTS.medium,
    fontWeight: "bold",
    flex: 1,
  },
  backButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  backButtonText: {
    color: "#fff",
    fontSize: FONTS.small,
  },
  plot: {
    color: "rgba(255,255,255,0.7)",
    fontSize: FONTS.small,
    marginBottom: SPACING.md,
  },
  episodesList: {
    gap: SPACING.sm,
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
