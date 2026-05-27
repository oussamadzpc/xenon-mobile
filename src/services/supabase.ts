import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://xxkgwizdagczsfzettdk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a2d3aXpkYWdjenNmemV0dGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNjk4NzcsImV4cCI6MjA5NDk0NTg3N30.TkhfAqhn2byJsTjKtdgxHn_Ql7fqWlHa08vJvXfch1Q";

const ExpoAsyncStorageAdapter = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
};

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: ExpoAsyncStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);