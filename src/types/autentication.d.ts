interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, keepLogged: boolean) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  }
  
  interface UserWithProfile extends User {
    username?: string;
  }