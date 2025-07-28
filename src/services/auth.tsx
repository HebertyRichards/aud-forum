"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/session`);

      if (res.ok) {
        const { user } = await res.json();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error("Falha ao buscar sessão", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const login = async (
    email: string,
    password: string,
    keepLogged: boolean
  ) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, keepLogged }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Falha no login");
    }
    await checkUserSession();
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Falha no registro");
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
