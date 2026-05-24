import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://xxkgwizdagczsfzettdk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a2d3aXpkYWdjenNmemV0dGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNjk4NzcsImV4cCI6MjA5NDk0NTg3N30.TkhfAqhn2byJsTjKtdgxHn_Ql7fqWlHa08vJvXfch1Q";

// Custom storage adapter for React Native
const ExpoAsyncStorageAdapter = {
  getItem: (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ExpoAsyncStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
