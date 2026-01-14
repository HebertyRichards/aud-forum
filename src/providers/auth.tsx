"use client";
import { createContext, useContext, ReactNode } from "react";
import { AuthContextType, UserWithProfile } from "@/types/autentication";
import { useAuthQueries } from "@/hooks/useAuthQueries";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const {
    sessionQuery,
    loginMutation,
    logoutMutation,
    registerMutation,
    updatePasswordMutation,
    forgotPasswordMutation,
  } = useAuthQueries();

  const updateUserAvatar = (newAvatarUrl: string) => {
    queryClient.setQueryData(
      ["auth-user"],
      (oldData: UserWithProfile | undefined) => {
        if (!oldData) return null;
        return {
          ...oldData,
          avatar_url: newAvatarUrl,
          user_metadata: { ...oldData.user_metadata, avatar_url: newAvatarUrl },
        };
      }
    );
  };

  const authContextValue: AuthContextType = {
    user: sessionQuery.data ?? null,
    loading: sessionQuery.isLoading,
    login: (email: string, password: string, keepLogged: boolean) =>
      loginMutation.mutateAsync({ email, password, keepLogged }),
    logout: logoutMutation.mutateAsync,
    register: (username: string, email: string, password: string) =>
      registerMutation.mutateAsync({ username, email, password }),
    updatePassword: (newPassword: string, accessToken: string) =>
      updatePasswordMutation.mutateAsync({ newPassword, accessToken }),
    forgotPassword: forgotPasswordMutation.mutateAsync,
    updateUserAvatar,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!sessionQuery.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
