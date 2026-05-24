import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../services/storage";

export interface User {
  name: string;
  code: string;
  expireDate: string;
  status: string;
  m3u_url: string;
  server: string;
  channels: number;
  movies: number;
  series: number;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const saved = await storage.getItem("xenoUser");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        await storage.removeItem("xenoUser");
      }
    }
    setLoading(false);
  };

  const login = async (userData: User) => {
    await storage.setItem("xenoUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await storage.removeItem("xenoUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
