import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import { getRemainingDays, isExpired } from "../utils/parsers";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [loginName, setLoginName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!loginName || !code) {
      alert("Enter credentials");
      return;
    }
    setLoading(true);
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("name", loginName)
        .eq("code", code)
        .maybeSingle();

      if (!data) {
        alert("Invalid login");
        setLoading(false);
        return;
      }

      if (!data.m3u_url) {
        alert("No playlist assigned");
        setLoading(false);
        return;
      }

      if (isExpired(data.expire_date) || data.status === "expired") {
        alert("Your subscription has expired. Please contact admin.");
        setLoading(false);
        return;
      }

      if (data.status === "suspended") {
        alert("Your account has been suspended by admin.");
        setLoading(false);
        return;
      }

      const loggedUser = {
        name: data.name,
        code: data.code,
        expireDate: data.expire_date,
        status: data.status,
        m3u_url: data.m3u_url,
        server: data.status === "active" ? "ONLINE" : "OFFLINE",
        channels: 1280,
        movies: 5420,
        series: 930,
      };

      await login(loggedUser);
      onNavigate("main");
    } catch (e) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.box}>
          <Text style={styles.title}>USER LOGIN</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={loginName}
            onChangeText={setLoginName}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Activation Code"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={code}
            onChangeText={setCode}
            autoCapitalize="none"
            secureTextEntry
          />

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={[styles.button, styles.loginButton]}
          >
            <Text style={styles.buttonText}>
              {loading ? "⏳ Loading..." : "LOGIN"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate("register")}
            style={[styles.button, styles.backButton]}
          >
            <Text style={styles.buttonText}>BACK</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: SPACING.xl,
  },
  input: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: FONTS.medium,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  button: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
  },
  backButton: {
    backgroundColor: "#1e293b",
    marginTop: SPACING.md,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: FONTS.medium,
    letterSpacing: 1,
  },
});
