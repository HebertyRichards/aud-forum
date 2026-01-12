"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserWithProfile } from "@/types/autentication";
import { handleApiError } from "@/utils/apiErrors";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      const res = await fetch(`/api/auth/session`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Sessão inválida");
      }
      const data = await res.json();
      setUser(data);
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
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, keepLogged }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message);
      }
      await checkUserSession();
    } catch (error) {
      throw handleApiError(error, "Não foi possível fazer o login.");
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message);
      }
    } catch (error) {
      throw handleApiError(error, "Não foi possível completar o registro.");
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message);
      }
    } catch (error) {
      throw handleApiError(error, "Não foi possível fazer o logout.");
    } finally {
      setUser(null);
    }
  };

  const updatePassword = async (newPassword: string, accessToken?: string) => {
    try {
      const res = await fetch(`/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, accessToken }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      throw handleApiError(error, "Não foi possível atualizar a senha.");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch(`/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      throw handleApiError(
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
