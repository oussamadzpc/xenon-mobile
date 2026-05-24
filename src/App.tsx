import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { supabase } from "./services/supabase";
import { storage } from "./services/storage";
import {
  parseXtreamUrl,
  fetchWithTimeout,
  getRemainingDays,
  isExpired,
  parseChannels,
  parseMovies,
  parseSeries,
  parseEpisodes,
} from "./utils/parsers";
import { COLORS, FONTS, SPACING } from "./constants/theme";

import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import WaitingScreen from "./screens/WaitingScreen";
import AppNavigator from "./navigation/AppNavigator";

import { Channel } from "./components/ChannelCard";
import { Movie } from "./components/MovieCard";
import { Series } from "./components/SeriesCard";
import { Episode } from "./components/EpisodeCard";

const Stack = createStackNavigator();

// ================= AUTH WRAPPER =================
function AuthWrapper() {
  const { user, login, logout } = useAuth();
  const [screen, setScreen] = useState<string>("register");
  const [name, setName] = useState("");

  // Content State
  const [liveChannels, setLiveChannels] = useState<Channel[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  // Selection State
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  // Status State
  const [serverStatus, setServerStatus] = useState("online");
  const [remainingDays, setRemainingDays] = useState(0);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Refs
  const contentLoadedRef = useRef(false);
  const initialChannelSetRef = useRef(false);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const daysIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto login check
  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    const savedUser = await storage.getItem("xenoUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        await login(parsed);
        setScreen("main");
      } catch (e) {
        await storage.removeItem("xenoUser");
      }
    }
  };

  // User status sync
  useEffect(() => {
    if (!user?.name || !user?.code) return;

    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("status, expire_date, m3u_url")
          .eq("name", user.name)
          .eq("code", user.code)
          .maybeSingle();

        if (error || !data) return;

        const isActive = data.status === "active";
        setServerStatus(isActive ? "online" : "offline");

        const days = getRemainingDays(data.expire_date);
        setRemainingDays(days);

        const expired =
          isExpired(data.expire_date) ||
          data.status === "expired" ||
          data.status === "suspended";
        setSubscriptionExpired(expired);

        if (expired) {
          setErrorMsg(
            data.status === "suspended"
              ? "⛔ Your account has been suspended by admin."
              : "⏰ Your subscription has expired. Please contact admin to renew."
          );
        }
      } catch (e) {
        console.error("Status sync error:", e);
      }
    };

    fetchUserStatus();
    statusIntervalRef.current = setInterval(fetchUserStatus, 30000);

    return () => {
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    };
  }, [user?.name, user?.code]);

  // Countdown timer
  useEffect(() => {
    if (!user?.expireDate) return;

    const updateDays = () => {
      const days = getRemainingDays(user.expireDate);
      setRemainingDays(days);
      if (days <= 0) {
        setSubscriptionExpired(true);
        setServerStatus("offline");
      }
    };

    updateDays();
    daysIntervalRef.current = setInterval(updateDays, 60000);

    return () => {
      if (daysIntervalRef.current) clearInterval(daysIntervalRef.current);
    };
  }, [user?.expireDate]);

  // Load content
  useEffect(() => {
    if (!user?.m3u_url) return;
    if (subscriptionExpired) {
      setErrorMsg("⏰ Subscription expired. Cannot load content.");
      return;
    }
    if (contentLoadedRef.current) return;
    if (liveChannels.length > 0 || movies.length > 0 || series.length > 0) return;

    contentLoadedRef.current = true;
    loadAllContent(user.m3u_url);
  }, [user?.m3u_url, subscriptionExpired]);

  const loadAllContent = async (sourceUrl: string) => {
    if (subscriptionExpired) return;

    setLoading(true);
    setErrorMsg("");

    const parsed = parseXtreamUrl(sourceUrl);
    if (!parsed || !parsed.username || !parsed.password) {
      setErrorMsg("Invalid URL");
      setLoading(false);
      return;
    }

    try {
      await Promise.all([
        loadLiveChannels(parsed),
        loadMovies(parsed),
        loadSeries(parsed),
      ]);
    } catch (err) {
      setErrorMsg("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const loadLiveChannels = async (parsed: any) => {
    try {
      const apiUrl = `${parsed.baseUrl}/player_api.php?username=${parsed.username}&password=${parsed.password}&action=get_live_streams`;
      const response = await fetchWithTimeout(
        apiUrl,
        { headers: { Accept: "application/json" } },
        15000
      );
      if (!response.ok) throw new Error("Live API error");

      const data = await response.json();
      if (!Array.isArray(data)) return;

      const channels = parseChannels(data, parsed);
      setLiveChannels(channels);

      if (channels.length > 0 && !initialChannelSetRef.current) {
        setSelectedChannel(channels[0]);
        initialChannelSetRef.current = true;
      }
    } catch (e) {
      console.error("Live load error:", e);
    }
  };

  const loadMovies = async (parsed: any) => {
    try {
      const apiUrl = `${parsed.baseUrl}/player_api.php?username=${parsed.username}&password=${parsed.password}&action=get_vod_streams`;
      const response = await fetchWithTimeout(
        apiUrl,
        { headers: { Accept: "application/json" } },
        15000
      );
      if (!response.ok) throw new Error("Movies API error");

      const data = await response.json();
      if (!Array.isArray(data)) return;

      const moviesList = parseMovies(data, parsed);
      setMovies(moviesList);
    } catch (e) {
      console.error("Movies load error:", e);
    }
  };

  const loadSeries = async (parsed: any) => {
    try {
      const apiUrl = `${parsed.baseUrl}/player_api.php?username=${parsed.username}&password=${parsed.password}&action=get_series`;
      const response = await fetchWithTimeout(
        apiUrl,
        { headers: { Accept: "application/json" } },
        15000
      );
      if (!response.ok) throw new Error("Series API error");

      const data = await response.json();
      if (!Array.isArray(data)) return;

      const seriesList = parseSeries(data);
      setSeries(seriesList);
    } catch (e) {
      console.error("Series load error:", e);
    }
  };

  const loadEpisodes = async (serie: Series) => {
    if (!serie?.seriesId || !user?.m3u_url) return;

    setLoading(true);
    const parsed = parseXtreamUrl(user.m3u_url);
    if (!parsed) {
      setLoading(false);
      return;
    }

    try {
      const apiUrl = `${parsed.baseUrl}/player_api.php?username=${parsed.username}&password=${parsed.password}&action=get_series_info&series_id=${serie.seriesId}`;
      const response = await fetchWithTimeout(
        apiUrl,
        { headers: { Accept: "application/json" } },
        15000
      );
      if (!response.ok) throw new Error("Episodes API error");

      const data = await response.json();
      const allEpisodes = parseEpisodes(data, parsed);

      setEpisodes(allEpisodes);
      if (allEpisodes.length > 0) {
        setSelectedEpisode(allEpisodes[0]);
      }
    } catch (e) {
      console.error("Episodes load error:", e);
      setErrorMsg("Failed to load episodes");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    contentLoadedRef.current = false;
    initialChannelSetRef.current = false;
    setLiveChannels([]);
    setMovies([]);
    setSeries([]);
    setEpisodes([]);
    setSelectedChannel(null);
    setSelectedMovie(null);
    setSelectedSeries(null);
    setSelectedEpisode(null);
    setErrorMsg("");
    setServerStatus("online");
    setRemainingDays(0);
    setSubscriptionExpired(false);
    setScreen("register");
  };

  // Navigation handler
  const handleNavigate = (targetScreen: string) => {
    setScreen(targetScreen);
  };

  // Render current screen
  if (screen === "register") {
    return (
      <RegisterScreen
        onNavigate={handleNavigate}
      />
    );
  }

  if (screen === "waiting") {
    return (
      <WaitingScreen
        name={name}
        onNavigate={handleNavigate}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onNavigate={handleNavigate}
      />
    );
  }

  if (screen === "main") {
    return (
      <AppNavigator
        liveChannels={liveChannels}
        movies={movies}
        series={series}
        episodes={episodes}
        selectedChannel={selectedChannel}
        selectedMovie={selectedMovie}
        selectedSeries={selectedSeries}
        selectedEpisode={selectedEpisode}
        onSelectChannel={setSelectedChannel}
        onSelectMovie={setSelectedMovie}
        onSelectSeries={setSelectedSeries}
        onSelectEpisode={setSelectedEpisode}
        onBackToSeries={() => {
          setSelectedSeries(null);
          setEpisodes([]);
          setSelectedEpisode(null);
        }}
        loadEpisodes={loadEpisodes}
        onWatchChannel={setSelectedChannel}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Unknown screen: {screen}</Text>
    </View>
  );
}

// ================= MAIN APP =================
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <AuthWrapper />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.medium,
  },
});
