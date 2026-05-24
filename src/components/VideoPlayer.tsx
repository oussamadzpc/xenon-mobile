import React, { useRef, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { COLORS, FONTS, SPACING } from "../constants/theme";

interface VideoPlayerProps {
  streamUrl: string;
  onError?: (error: string) => void;
}

export default function VideoPlayer({ streamUrl, onError }: VideoPlayerProps) {
  const videoRef = useRef<VideoView>(null);

  const player = useVideoPlayer(streamUrl, (player) => {
    player.loop = false;
    player.play();
  });

  // Handle errors
  React.useEffect(() => {
    const playerError = (player as any).error;
    if (playerError) {
      onError?.(playerError.message || "Failed to load stream");
    }
  }, [(player as any).error]);

  return (
    <View style={styles.container}>
      <VideoView
        ref={videoRef}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        startsPictureInPictureAutomatically
        nativeControls
      />

      {!streamUrl && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>⚠️ No stream selected</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loadingText: {
    color: COLORS.primary,
    marginTop: SPACING.md,
    fontSize: FONTS.medium,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.medium,
    fontWeight: "bold",
  },
});