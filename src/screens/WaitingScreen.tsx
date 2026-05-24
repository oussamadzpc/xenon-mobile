import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { supabase } from "../services/supabase";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

interface WaitingScreenProps {
  name: string;
  onNavigate: (screen: string) => void;
}

export default function WaitingScreen({ name, onNavigate }: WaitingScreenProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("requests")
          .select("*")
          .eq("username", name)
          .maybeSingle();

        if (data?.status === "approved") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onNavigate("login");
        }
      } catch (e) {}
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [name]);

  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.box}>
        <Text style={styles.title}>WAITING APPROVAL</Text>
        <Text style={styles.subtitle}>Request sent to admin...</Text>
        <View style={styles.spinner}>
          <Text style={styles.spinnerText}>⏳</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  glowTop: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0,229,255,0.15)",
    top: -100,
    left: -100,
  },
  glowBottom: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,0,128,0.12)",
    bottom: -100,
    right: -100,
  },
  box: {
    width: "100%",
    maxWidth: 380,
    padding: SPACING.xxl,
    borderRadius: RADIUS.xxl,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    ...SHADOWS.large,
  },
  title: {
    fontSize: FONTS.hero,
    fontWeight: "900",
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.medium,
    color: "rgba(255,255,255,0.7)",
    marginBottom: SPACING.xl,
  },
  spinner: {
    marginTop: SPACING.lg,
  },
  spinnerText: {
    fontSize: 40,
  },
});
