import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

export interface Channel {
  name: string;
  url: string;
  logo: string;
  group: string;
  groupId: string;
  type: string;
  streamId: string;
  country?: { flag: string; name: string } | null;
  beinLanguage?: string | null;
  isBeinSport?: boolean;
}

interface ChannelCardProps {
  channel: Channel;
  isSelected: boolean;
  onPress: () => void;
}

export default function ChannelCard({ channel, isSelected, onPress }: ChannelCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, isSelected && styles.selected]}
    >
      {/* Glow Effect */}
      <View style={[styles.glow, isSelected && styles.glowActive]} />

      {/* Icon/Logo */}
      <View style={styles.iconContainer}>
        {channel.logo ? (
          <Image source={{ uri: channel.logo }} style={styles.logo} resizeMode="cover" />
        ) : (
          <View style={styles.fallbackIcon}>
            <Text style={styles.fallbackText}>{channel.name.charAt(0)}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {channel.name}
        </Text>
        {channel.country && (
          <Text style={styles.country} numberOfLines={1}>
            {channel.country.flag} {channel.country.name}
          </Text>
        )}
      </View>

      {/* Active Indicator */}
      {isSelected && <View style={styles.activeIndicator} />}
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
    borderColor: "rgba(0,229,255,0.1)",
  },
  selected: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(0,229,255,0.1)",
    ...SHADOWS.glow,
  },
  glow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: RADIUS.lg + 2,
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.3)",
    opacity: 0,
  },
  glowActive: {
    opacity: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginRight: SPACING.md,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  fallbackIcon: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "#fff",
    fontSize: FONTS.large,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: "600",
  },
  country: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    marginTop: 2,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.online,
    marginLeft: SPACING.sm,
  },
});
