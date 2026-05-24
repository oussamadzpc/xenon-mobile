import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";
import { Channel } from "./ChannelCard";

const THESPORTSDB_URL = "https://www.thesportsdb.com/api/v1/json/3";

const DEMO_MATCHES = [
  {
    id: "demo-1",
    homeTeam: "ريال مدريد",
    awayTeam: "برشلونة",
    homeLogo: "https://www.thesportsdb.com/images/media/team/badge/vsqxqp1448813435.png",
    awayLogo: "https://www.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png",
    league: "La Liga",
    leaguePriority: 1,
    leagueDisplay: "الدوري الإسباني 🇪🇸",
    status: "LIVE",
    isLive: true,
    matchTime: new Date().getTime() / 1000,
    score: "2 - 1",
    source: "demo",
  },
  {
    id: "demo-2",
    homeTeam: "مانشستر يونايتد",
    awayTeam: "ليفربول",
    homeLogo: "https://www.thesportsdb.com/images/media/team/badge/rwqrrq1448813171.png",
    awayLogo: "https://www.thesportsdb.com/images/media/team/badge/uvxuqq1448813377.png",
    league: "Premier League",
    leaguePriority: 2,
    leagueDisplay: "الدوري الإنجليزي 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    status: "NS",
    isLive: false,
    matchTime: (new Date().getTime() / 1000) + 3600,
    score: null,
    source: "demo",
  },
  {
    id: "demo-3",
    homeTeam: "الهلال",
    awayTeam: "النصر",
    homeLogo: "",
    awayLogo: "",
    league: "Saudi Pro League",
    leaguePriority: 3,
    leagueDisplay: "الدوري السعودي 🇸🇦",
    status: "NS",
    isLive: false,
    matchTime: (new Date().getTime() / 1000) + 7200,
    score: null,
    source: "demo",
  },
  {
    id: "demo-4",
    homeTeam: "بايرن ميونخ",
    awayTeam: "بوروسيا دورتموند",
    homeLogo: "",
    awayLogo: "",
    league: "Bundesliga",
    leaguePriority: 4,
    leagueDisplay: "الدوري الألماني 🇩🇪",
    status: "NS",
    isLive: false,
    matchTime: (new Date().getTime() / 1000) + 10800,
    score: null,
    source: "demo",
  },
  {
    id: "demo-5",
    homeTeam: "باريس سان جيرمان",
    awayTeam: "مارسيليا",
    homeLogo: "",
    awayLogo: "",
    league: "Ligue 1",
    leaguePriority: 5,
    leagueDisplay: "الدوري الفرنسي 🇫🇷",
    status: "NS",
    isLive: false,
    matchTime: (new Date().getTime() / 1000) + 14400,
    score: null,
    source: "demo",
  },
  {
    id: "demo-6",
    homeTeam: "يوفنتوس",
    awayTeam: "إنتر ميلان",
    homeLogo: "",
    awayLogo: "",
    league: "Serie A",
    leaguePriority: 6,
    leagueDisplay: "الدوري الإيطالي 🇮🇹",
    status: "LIVE",
    isLive: true,
    matchTime: new Date().getTime() / 1000,
    score: "1 - 1",
    source: "demo",
  },
];

const LEAGUE_PRIORITY: Record<string, number> = {
  "Primera Division": 1, "La Liga": 1, "LaLiga": 1,
  "Premier League": 2, "Premier": 2,
  "Saudi Professional League": 3, "Saudi Pro League": 3, "Saudi": 3,
  "Bundesliga": 4,
  "Ligue 1": 5, "Ligue 1 Uber Eats": 5,
  "Serie A": 6, "Italian Serie A": 6,
};

const ARABIC_LEAGUE_NAMES: Record<string, string> = {
  "Primera Division": "الدوري الإسباني 🇪🇸",
  "La Liga": "الدوري الإسباني 🇪🇸",
  "Premier League": "الدوري الإنجليزي 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Saudi Professional League": "الدوري السعودي 🇸🇦",
  "Bundesliga": "الدوري الألماني 🇩🇪",
  "Ligue 1": "الدوري الفرنسي 🇫🇷",
  "Serie A": "الدوري الإيطالي 🇮🇹",
};

const getLeaguePriority = (name: string): number => {
  if (!name) return 999;
  if (LEAGUE_PRIORITY[name] !== undefined) return LEAGUE_PRIORITY[name];
  for (const [key, value] of Object.entries(LEAGUE_PRIORITY)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return 999;
};

const getLeagueDisplayName = (name: string): string => {
  return ARABIC_LEAGUE_NAMES[name] || name;
};

const getTodayDate = () => new Date().toISOString().split("T")[0];

const formatMatchTime = (timestamp: number): string => {
  if (!timestamp) return "?";
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const findMatchingChannel = (liveChannels: Channel[]): Channel | null => {
  if (!liveChannels || liveChannels.length === 0) return null;
  for (const channel of liveChannels) {
    const chName = channel.name.toLowerCase();
    if (
      chName.includes("bein") ||
      chName.includes("ssc") ||
      chName.includes("dazn") ||
      chName.includes("sport")
    ) {
      return channel;
    }
  }
  return null;
};

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  league: string;
  leaguePriority: number;
  leagueDisplay: string;
  status: string;
  isLive: boolean;
  matchTime: number;
  score: string | null;
  source: string;
}

interface LiveMatchesWidgetProps {
  liveChannels: Channel[];
  onWatchChannel: (channel: Channel, match: Match) => void;
}

export default function LiveMatchesWidget({
  liveChannels,
  onWatchChannel,
}: LiveMatchesWidgetProps) {
  const [matches, setMatches] = useState<Match[]>(DEMO_MATCHES);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [useDemo, setUseDemo] = useState(true);

  const FEATURED_COUNT = 2;
  const featuredMatches = matches.slice(0, FEATURED_COUNT);
  const remainingMatches = matches.slice(FEATURED_COUNT);
  const hasMoreMatches = remainingMatches.length > 0;

  const handleWatch = (match: Match) => {
    const channel = findMatchingChannel(liveChannels);
    if (channel && onWatchChannel) {
      onWatchChannel(channel, match);
    }
  };

  const renderStatus = (match: Match) => {
    if (match.isLive) {
      return (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      );
    }
    if (match.score) {
      return (
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>FT {match.score}</Text>
        </View>
      );
    }
    return (
      <View style={styles.timeBadge}>
        <Text style={styles.timeText}>{formatMatchTime(match.matchTime)}</Text>
      </View>
    );
  };

  const renderMatch = (match: Match, isFeatured: boolean = false) => (
    <TouchableOpacity
      key={match.id}
      onPress={() => handleWatch(match)}
      activeOpacity={0.8}
      style={[styles.matchContainer, match.isLive && styles.matchLive]}
    >
      {/* Teams */}
      <View style={styles.teamsContainer}>
        {/* Home Team */}
        <View style={styles.teamSide}>
          <Text style={styles.teamName} numberOfLines={1}>
            {match.homeTeam}
          </Text>
          {match.homeLogo ? (
            <Image
              source={{ uri: match.homeLogo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          ) : null}
        </View>

        {/* VS / Score */}
        <View
          style={[
            styles.vsContainer,
            match.isLive && styles.vsLive,
            match.score && styles.vsFinished,
          ]}
        >
          <Text
            style={[
              styles.vsText,
              match.isLive && styles.vsTextLive,
              match.score && styles.vsTextFinished,
            ]}
          >
            {match.score || "VS"}
          </Text>
        </View>

        {/* Away Team */}
        <View style={[styles.teamSide, styles.teamSideRight]}>
          {match.awayLogo ? (
            <Image
              source={{ uri: match.awayLogo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          ) : null}
          <Text style={styles.teamName} numberOfLines={1}>
            {match.awayTeam}
          </Text>
        </View>
      </View>

      {/* Status & League */}
      <View style={styles.statusContainer}>
        {renderStatus(match)}
        <Text style={styles.leagueText}>{match.leagueDisplay}</Text>
        {match.source === "demo" && (
          <Text style={styles.demoText}>Demo</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerEmoji}>⚽</Text>
          <View>
            <Text style={styles.headerTitle}>Live Matches</Text>
            <Text style={styles.headerSubtitle}>
              {matches.length} matches today
            </Text>
          </View>
        </View>
        {useDemo && (
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>⚠️ Demo</Text>
          </View>
        )}
      </View>

      {/* Featured Matches */}
      <View style={styles.matchesList}>
        {featuredMatches.map((match) => renderMatch(match, true))}
      </View>

      {/* Show More */}
      {hasMoreMatches && !showAll && (
        <TouchableOpacity
          onPress={() => setShowAll(true)}
          style={styles.showMoreButton}
        >
          <Text style={styles.showMoreText}>
            📋 عرض المزيد ({remainingMatches.length} مباراة إضافية) ▼
          </Text>
        </TouchableOpacity>
      )}

      {/* Remaining Matches */}
      {showAll && remainingMatches.length > 0 && (
        <View style={styles.matchesList}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>مباريات إضافية</Text>
            <View style={styles.dividerLine} />
          </View>
          {remainingMatches.map((match) => renderMatch(match))}

          <TouchableOpacity
            onPress={() => setShowAll(false)}
            style={styles.hideButton}
          >
            <Text style={styles.hideText}>▲ إخفاء المباريات الإضافية</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: FONTS.title,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    marginTop: 2,
  },
  demoBadge: {
    backgroundColor: "rgba(255,170,0,0.1)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  demoBadgeText: {
    color: COLORS.warning,
    fontSize: FONTS.tiny,
  },
  matchesList: {
    gap: SPACING.md,
  },
  matchContainer: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  matchLive: {
    backgroundColor: "rgba(255,0,0,0.05)",
    borderColor: "rgba(255,0,0,0.2)",
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  teamSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: SPACING.sm,
  },
  teamSideRight: {
    justifyContent: "flex-end",
  },
  teamName: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: "bold",
    flex: 1,
  },
  teamLogo: {
    width: 28,
    height: 28,
  },
  vsContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    minWidth: 50,
    alignItems: "center",
  },
  vsLive: {
    backgroundColor: "rgba(255,0,0,0.15)",
  },
  vsFinished: {
    backgroundColor: "rgba(0,255,136,0.15)",
  },
  vsText: {
    color: "#fff",
    fontSize: FONTS.medium,
    fontWeight: "bold",
  },
  vsTextLive: {
    color: "#ff4444",
  },
  vsTextFinished: {
    color: "#00ff88",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,0,0,0.2)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff4444",
  },
  liveText: {
    color: "#ff4444",
    fontSize: FONTS.tiny,
    fontWeight: "bold",
  },
  scoreBadge: {
    backgroundColor: "rgba(100,100,100,0.2)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  scoreText: {
    color: "#888",
    fontSize: FONTS.tiny,
    fontWeight: "bold",
  },
  timeBadge: {
    backgroundColor: "rgba(0,150,255,0.15)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  timeText: {
    color: "#00bfff",
    fontSize: FONTS.tiny,
    fontWeight: "bold",
  },
  leagueText: {
    color: COLORS.primary,
    fontSize: FONTS.tiny,
    opacity: 0.7,
  },
  demoText: {
    color: COLORS.warning,
    fontSize: FONTS.tiny,
    opacity: 0.4,
  },
  showMoreButton: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(0,229,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.2)",
    alignItems: "center",
  },
  showMoreText: {
    color: COLORS.primary,
    fontSize: FONTS.small,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.md,
    gap: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    color: "#888",
    fontSize: FONTS.tiny,
    opacity: 0.5,
  },
  hideButton: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  hideText: {
    color: "#888",
    fontSize: FONTS.small,
  },
});
