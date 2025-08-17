import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: UserWithProfile | null;
  loading: boolean;
  login: (email: string, password: string, keepLogged: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (newPassword: string, accessToken: string) => Promise<void>
  forgotPassword:(email: string) => Promise<void>
  updateUserAvatar: (newAvatarUrl: string) => void;
}

export interface UserWithProfile extends User {
  username?: string;
}