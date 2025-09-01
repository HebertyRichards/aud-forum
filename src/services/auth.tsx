"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserWithProfile } from "@/types/autentication";
import { handleAuthError } from "@/utils/errorsAuth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/session`, {
        withCredentials: true,
      });
      setUser(res.data);
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
      await axios.post(
        `${API_URL}/auth/login`,
        { email, password, keepLogged },
        { withCredentials: true }
      );
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
      await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
    } catch (error: unknown) {
      throw handleAuthError(error, "Não foi possível completar o registro.");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error: unknown) {
      throw handleAuthError(error, "Não foi possível fazer o logout.");
    } finally {
      setUser(null);
    }
  };

  const updatePassword = async (newPassword: string, accessToken?: string) => {
    try {
      const res = await axios.put(
        `${API_URL}/auth/change-password`,
        { newPassword, accessToken },
        { withCredentials: true }
      );
      return res.data;
    } catch (error: unknown) {
      throw handleAuthError(error, "Não foi possível atualizar a senha.");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      return res.data;
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
