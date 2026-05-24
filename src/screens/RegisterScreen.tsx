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
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../constants/theme";

interface RegisterScreenProps {
  onNavigate: (screen: string) => void;
}

export default function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { data: existingRequest } = await supabase
        .from("requests")
        .select("*")
        .eq("username", name)
        .maybeSingle();

      if (existingRequest) {
        alert("Username exists");
        setLoading(false);
        return;
      }

      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("name", name)
        .maybeSingle();

      if (existingUser) {
        alert("Already activated");
        setLoading(false);
        return;
      }

      await supabase.from("requests").insert([{ username: name, status: "pending" }]);
      onNavigate("waiting");
    } catch (e) {
      alert("Registration failed");
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
        {/* Background Glow */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.box}>
          <Text style={styles.title}>XENO 4K PRO</Text>
          <Text style={styles.subtitle}>Premium IPTV Activation</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={register}
            disabled={loading}
            style={[styles.button, styles.registerButton]}
          >
            <Text style={styles.buttonText}>
              {loading ? "⏳ Loading..." : "REGISTER"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate("login")}
            style={[styles.button, styles.loginButton]}
          >
            <Text style={styles.buttonText}>USER LOGIN</Text>
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
    filter: "blur(80px)",
  },
  glowBottom: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,0,128,0.12)",
    bottom: -100,
    right: -100,
    filter: "blur(80px)",
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
  registerButton: {
    backgroundColor: COLORS.primary,
  },
  loginButton: {
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
