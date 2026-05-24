import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import LiveMatchesWidget from "../components/LiveMatchesWidget";
import { Channel } from "../components/ChannelCard";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

interface DashboardScreenProps {
  liveChannels: Channel[];
  onNavigate: (screen: string) => void;
  onWatchChannel: (channel: Channel) => void;
}

export default function DashboardScreen({
  liveChannels,
  onNavigate,
  onWatchChannel,
}: DashboardScreenProps) {
  const { user } = useAuth();

  const cards = [
    {
      id: "live",
      title: "LIVE",
      emoji: "📡",
      count: liveChannels.length,
      gradient: ["#00f5a0", "#00d9f5"],
      onPress: () => onNavigate("live"),
    },
    {
      id: "movies",
      title: "MOVIES",
      emoji: "🎬",
      count: user?.movies || 0,
      gradient: ["#ff0055", "#ff9900"],
      onPress: () => onNavigate("movies"),
    },
    {
      id: "series",
      title: "SERIES",
      emoji: "📺",
      count: user?.series || 0,
      gradient: ["#7a5cff", "#00e5ff"],
      onPress: () => onNavigate("series"),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Live Matches Widget */}
      <LiveMatchesWidget
        liveChannels={liveChannels}
        onWatchChannel={(channel) => onWatchChannel(channel)}
      />

      {/* Cards Grid */}
      <View style={styles.cardsGrid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={card.onPress}
            activeOpacity={0.8}
            style={styles.cardContainer}
          >
            <View
              style={[
                styles.card,
                { backgroundColor: card.gradient[0] },
              ]}
            >
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                <Text style={styles.cardEmoji}>{card.emoji}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardCount}>
                  {card.count.toLocaleString()} {card.id === "live" ? "channels" : card.id === "movies" ? "movies" : "series"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  cardContainer: {
    width: "100%",
    marginBottom: SPACING.md,
  },
  card: {
    height: 160,
    borderRadius: RADIUS.xxl,
    overflow: "hidden",
    position: "relative",
    ...SHADOWS.medium,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    color: "#fff",
    fontSize: FONTS.header,
    fontWeight: "900",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  cardCount: {
    color: "rgba(255,255,255,0.9)",
    fontSize: FONTS.small,
    fontWeight: "600",
    marginTop: 4,
  },
});
