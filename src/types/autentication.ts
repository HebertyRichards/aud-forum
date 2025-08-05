import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: UserWithProfile | null;
  loading: boolean;
  login: (email: string, password: string, keepLogged: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface UserWithProfile extends User {
  username?: string;
}