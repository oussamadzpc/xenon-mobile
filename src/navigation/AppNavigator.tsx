import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, StyleSheet } from "react-native";
import DashboardScreen from "../screens/DashboardScreen";
import LiveTVScreen from "../screens/LiveTVScreen";
import MoviesScreen from "../screens/MoviesScreen";
import SeriesScreen from "../screens/SeriesScreen";
import { Channel } from "../components/ChannelCard";
import { Movie } from "../components/MovieCard";
import { Series } from "../components/SeriesCard";
import { Episode } from "../components/EpisodeCard";
import { COLORS, FONTS } from "../constants/theme";

const Tab = createBottomTabNavigator();

interface AppNavigatorProps {
  liveChannels: Channel[];
  movies: Movie[];
  series: Series[];
  episodes: Episode[];
  selectedChannel: Channel | null;
  selectedMovie: Movie | null;
  selectedSeries: Series | null;
  selectedEpisode: Episode | null;
  onSelectChannel: (channel: Channel) => void;
  onSelectMovie: (movie: Movie) => void;
  onSelectSeries: (series: Series) => void;
  onSelectEpisode: (episode: Episode) => void;
  onBackToSeries: () => void;
  loadEpisodes: (series: Series) => void;
  onWatchChannel: (channel: Channel) => void;
}

export default function AppNavigator({
  liveChannels,
  movies,
  series,
  episodes,
  selectedChannel,
  selectedMovie,
  selectedSeries,
  selectedEpisode,
  onSelectChannel,
  onSelectMovie,
  onSelectSeries,
  onSelectEpisode,
  onBackToSeries,
  loadEpisodes,
  onWatchChannel,
}: AppNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>🏠</Text>
          ),
        }}
      >
        {() => (
          <DashboardScreen
            liveChannels={liveChannels}
            onNavigate={(screen) => {}}
            onWatchChannel={onWatchChannel}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Live TV"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>📺</Text>
          ),
          tabBarBadge: liveChannels.length > 0 ? liveChannels.length : undefined,
        }}
      >
        {() => (
          <LiveTVScreen
            liveChannels={liveChannels}
            selectedChannel={selectedChannel}
            onSelectChannel={onSelectChannel}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Movies"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>🎬</Text>
          ),
        }}
      >
        {() => (
          <MoviesScreen
            movies={movies}
            selectedMovie={selectedMovie}
            onSelectMovie={onSelectMovie}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Series"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>📺</Text>
          ),
        }}
      >
        {() => (
          <SeriesScreen
            series={series}
            episodes={episodes}
            selectedSeries={selectedSeries}
            selectedEpisode={selectedEpisode}
            onSelectSeries={onSelectSeries}
            onSelectEpisode={onSelectEpisode}
            onBackToSeries={onBackToSeries}
            loadEpisodes={loadEpisodes}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(5,6,10,0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  },
  icon: {
    fontSize: 20,
  },
});
