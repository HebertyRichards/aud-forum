import type { User } from "@supabase/supabase-js";
import { UserProfile } from "@/schema/user";

export interface AuthContextType {
  user: UserWithProfile | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    keepLogged: boolean
  ) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (newPassword: string, accessToken: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserAvatar: (newAvatarUrl: string) => void;
}

export interface UserWithProfile
  extends User,
    Partial<Pick<UserProfile, "username" | "avatar_url" | "role">> {
  access_token?: string;
  avatarUrl?: string; // camelCase version from backend
}
