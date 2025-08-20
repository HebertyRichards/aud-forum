"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserWithProfile } from "@/types/autentication";
import { handleAuthError } from "@/utils/errorsAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/session`, {
        credentials: "include",
      });

      if (res.ok) {
        const user = await res.json();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
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
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, keepLogged }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha no login");
      }
      await checkUserSession();
    } catch (error: unknown) {
      throw handleAuthError(error, "Não foi possível fazer o login.");
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Falha no registro");
      }
    } catch (error: unknown) {
      throw handleAuthError(error, "Não foi possível completar o registro.");
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Falha ao comunicar com o servidor."
        );
      }
    } catch (error: unknown) {
      throw handleAuthError(error, "Não foi possível fazer o logout.");
    } finally {
      setUser(null);
    }
  };

  const updatePassword = async (newPassword: string, accessToken?: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword, accessToken }),
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Erro ao atualizar a senha." }));
        throw new Error(errorData.error);
      }
      return await res.json();
    } catch (error: unknown) {
      throw handleAuthError(error, "Não foi possível atualizar a senha.");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Erro ao enviar e-mail de recuperação." }));
        throw new Error(errorData.error);
      }
      return await res.json();
    } catch (error: unknown) {
      throw handleAuthError(
        error,
        "Não foi possível enviar o e-mail de recuperação."
      );
    }
  };

  const updateUserAvatar = (newAvatarUrl: string) => {
    setUser((currentUser) => {
      if (!currentUser) return null;
      return {
        ...currentUser,
        avatar_url: newAvatarUrl,
        user_metadata: {
          ...currentUser.user_metadata,
          avatar_url: newAvatarUrl,
        },
      };
    });
  };

  const authContextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updatePassword,
    forgotPassword,
    updateUserAvatar,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
