"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserWithProfile } from "@/types/autentication";

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
    } catch (error) {
      setUser(null);
      console.error("Erro ao verificar sessão do usuário:", error);
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
    } catch (error) {
      console.error("Falha ao fazer login:", error);
      throw error;
    }
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
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Falha ao fazer logout:", error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        let errorMessage = "Erro ao atualizar a senha.";

        try {
          const contentType = response.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const errorJson = await response.json();
            errorMessage = errorJson?.error || errorMessage;
          } else {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
        } catch {
          errorMessage = "Erro inesperado no servidor.";
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Falha ao atualizar a senha", error);
      throw error;
    }
  };
  const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");

      let errorMessage = "Erro ao enviar e-mail.";

      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        errorMessage = errorJson?.error || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updatePassword,
        forgotPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
