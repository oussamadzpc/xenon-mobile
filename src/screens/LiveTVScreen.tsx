import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import VideoPlayer from "../components/VideoPlayer";
import ChannelCard, { Channel } from "../components/ChannelCard";
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme";

interface LiveTVScreenProps {
  liveChannels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
}

export default function LiveTVScreen({
  liveChannels,
  selectedChannel,
  onSelectChannel,
}: LiveTVScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Group channels
  const groupedChannels = useMemo(() => {
    const groups: Record<string, Channel[]> = {};

    liveChannels.forEach((ch) => {
      let groupName = "";

      if (ch.isBeinSport) {
        if (ch.beinLanguage === "fr") groupName = "⚽ Bein Sport - French";
        else if (ch.beinLanguage === "en") groupName = "⚽ Bein Sport - English";
        else if (ch.beinLanguage === "es") groupName = "⚽ Bein Sport - Spanish";
        else if (ch.beinLanguage === "tr") groupName = "⚽ Bein Sport - Turkish";
        else if (ch.beinLanguage === "de") groupName = "⚽ Bein Sport - German";
        else groupName = "⚽ Bein Sport - Arabic";
      } else if (ch.country) {
        groupName = `${ch.country.flag} ${(ch.country as any).code || ''} ${ch.country.name}`;
      } else {
        const nameLower = ch.name.toLowerCase();
        const groupLower = (ch.group || "").toLowerCase();

        if (groupLower.includes("sport") || nameLower.includes("sport")) {
          groupName = "⚽ Sports Channels";
        } else if (groupLower.includes("movie") || groupLower.includes("cinema")) {
          groupName = "🎬 Movies & Cinema";
        } else if (groupLower.includes("news")) {
          groupName = "📰 News Channels";
        } else if (groupLower.includes("kids") || groupLower.includes("cartoon")) {
          groupName = "👶 Kids & Cartoons";
        } else if (groupLower.includes("music")) {
          groupName = "🎵 Music";
        } else if (groupLower.includes("religion") || groupLower.includes("islam")) {
          groupName = "🕌 Religious";
        } else if (groupLower.includes("doc")) {
          groupName = "📚 Documentary";
        } else {
          groupName = "📺 General & Entertainment";
        }
      }

      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(ch);
    });

    return groups;
  }, [liveChannels]);

  // Filter
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedChannels;
    const q = searchQuery.toLowerCase();
    const filtered: Record<string, Channel[]> = {};

    Object.keys(groupedChannels).forEach((groupName) => {
      const matching = groupedChannels[groupName].filter(
        (ch) =>
          ch.name.toLowerCase().includes(q) ||
          ch.group.toLowerCase().includes(q) ||
          (ch.country && ch.country.name.toLowerCase().includes(q))
      );
      if (matching.length > 0) {
        filtered[groupName] = matching;
      }
    });

    return filtered;
  }, [groupedChannels, searchQuery]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev: Record<string, boolean>) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(groupedChannels).forEach((g) => (allExpanded[g] = true));
    setExpandedGroups(allExpanded);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <View>
          <Text style={styles.heroTitle}>📺 LIVE TV</Text>
          <Text style={styles.heroSubtitle}>Ultra HD Streaming</Text>
        </View>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>● LIVE</Text>
        </View>
      </View>

      {/* Video Player */}
      {selectedChannel && (
        <VideoPlayer streamUrl={selectedChannel.url} />
      )}

      {/* Channel Info */}
      {selectedChannel && (
        <View style={styles.channelInfo}>
          <Text style={styles.channelName}>
            ▶️ {selectedChannel.name}
            {selectedChannel.country &&
              ` • ${selectedChannel.country.flag} ${selectedChannel.country.name}`}
          </Text>
        </View>
      )}

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search channels..."
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={expandAll} style={styles.controlButton}>
          <Text style={styles.controlButtonText}>📂 Expand All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={collapseAll} style={styles.controlButtonSecondary}>
          <Text style={styles.controlButtonTextSecondary}>📁 Collapse All</Text>
        </TouchableOpacity>
        <Text style={styles.stats}>
          {Object.keys(filteredGroups).length} groups • {liveChannels.length} channels
        </Text>
      </View>

      {/* Channel Groups */}
      <ScrollView style={styles.groupsList}>
        {Object.keys(filteredGroups).length > 0 ? (
          Object.keys(filteredGroups).map((groupName) => {
            const isExpanded = expandedGroups[groupName];
            const channels = filteredGroups[groupName];
            const isBein = groupName.includes("Bein");
            const isCountry = groupName.includes("🇦🇪") || groupName.includes("🇪🇬"); // simplified check
            const isSport = groupName.includes("Sport") && !isBein;

            return (
              <View key={groupName} style={styles.groupContainer}>
                <TouchableOpacity
                  onPress={() => toggleGroup(groupName)}
                  style={[
                    styles.groupHeader,
                    isBein && styles.groupHeaderBein,
                    isCountry && styles.groupHeaderCountry,
                    isSport && styles.groupHeaderSport,
                  ]}
                >
                  <View style={styles.groupHeaderLeft}>
                    <View
                      style={[
                        styles.groupIcon,
                        isBein && styles.groupIconBein,
                        isCountry && styles.groupIconCountry,
                        isSport && styles.groupIconSport,
                      ]}
                    >
                      <Text>
                        {isBein ? "⚽" : isCountry ? "🌍" : isSport ? "🏆" : "📺"}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.groupName,
                        isBein && styles.groupNameBein,
                        isCountry && styles.groupNameCountry,
                        isSport && styles.groupNameSport,
                      ]}
                    >
                      {groupName}
                    </Text>
                    <View style={styles.groupCount}>
                      <Text style={styles.groupCountText}>{channels.length}</Text>
                    </View>
                  </View>
                  <Text style={styles.groupToggle}>
                    {isExpanded ? "▲ Close" : "▼ Open"}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.channelsList}>
                    {channels.map((ch, idx) => (
                      <ChannelCard
                        key={`${groupName}-${idx}`}
                        channel={ch}
                        isSelected={selectedChannel?.streamId === ch.streamId}
                        onPress={() => onSelectChannel(ch)}
                      />
                    ))}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "🔍 No channels match your search"
                : liveChannels.length === 0
                ? "⏳ Loading..."
                : "📡 No channels available"}
            </Text>
          </View>
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: RADIUS.xxl,
    backgroundColor: "rgba(0,229,255,0.12)",
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
  liveBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    backgroundColor: "rgba(0,255,100,0.15)",
    borderWidth: 1,
    borderColor: "rgba(0,255,100,0.25)",
  },
  liveBadgeText: {
    color: "#00ff88",
    fontWeight: "800",
    fontSize: FONTS.small,
  },
  channelInfo: {
    paddingVertical: SPACING.md,
  },
  channelName: {
    color: COLORS.primary,
    fontSize: FONTS.medium,
    fontWeight: "bold",
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
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  controlButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(0,229,255,0.2)",
  },
  controlButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.small,
    fontWeight: "bold",
  },
  controlButtonSecondary: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  controlButtonTextSecondary: {
    color: "#fff",
    fontSize: FONTS.small,
  },
  stats: {
    marginLeft: "auto",
    color: "rgba(255,255,255,0.5)",
    fontSize: FONTS.small,
  },
  groupsList: {
    flex: 1,
  },
  groupContainer: {
    marginBottom: SPACING.md,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  groupHeaderBein: {
    backgroundColor: "rgba(0,200,100,0.15)",
    borderColor: "rgba(0,200,100,0.3)",
  },
  groupHeaderCountry: {
    backgroundColor: "rgba(0,150,255,0.12)",
    borderColor: "rgba(0,150,255,0.25)",
  },
  groupHeaderSport: {
    backgroundColor: "rgba(255,180,0,0.12)",
    borderColor: "rgba(255,180,0,0.25)",
  },
  groupHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  groupIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  groupIconBein: {
    backgroundColor: "rgba(0,200,100,0.3)",
  },
  groupIconCountry: {
    backgroundColor: "rgba(0,150,255,0.3)",
  },
  groupIconSport: {
    backgroundColor: "rgba(255,180,0,0.3)",
  },
  groupName: {
    fontWeight: "bold",
    fontSize: FONTS.medium,
    color: "#fff",
  },
  groupNameBein: {
    color: "#00ff88",
  },
  groupNameCountry: {
    color: "#00bfff",
  },
  groupNameSport: {
    color: "#ffb400",
  },
  groupCount: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  groupCountText: {
    fontSize: FONTS.tiny,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "bold",
  },
  groupToggle: {
    fontSize: FONTS.small,
    color: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  channelsList: {
    marginTop: SPACING.sm,
  },
  emptyState: {
    padding: SPACING.xxxl,
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: FONTS.medium,
  },
});