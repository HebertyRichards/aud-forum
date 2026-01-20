import { UserWithProfile } from "@/types/autentication";
import { httpClient } from "./core/httpClient";

export interface LoginCredentials {
  email: string;
  password: string;
  keepLogged: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UpdatePasswordData {
  newPassword: string;
  accessToken?: string;
}

export const authService = {
  async getSession(): Promise<UserWithProfile> {
    const response = await httpClient.get<UserWithProfile>("/auth/session");
    if (!response) {
      throw new Error("Failed to get session");
    }
    return response;
  },

  async login(credentials: LoginCredentials) {
    return httpClient.post("/auth/login", credentials);
  
  },

  async register(data: RegisterData) {
    return httpClient.post("/auth/register", data);
  },

  async logout(): Promise<void> {
    await httpClient.post("/auth/logout", {});
  },

  async updatePassword(data: UpdatePasswordData) {
    return httpClient.put("/auth/change-password", data);
  },

  async forgotPassword(email: string) {
    return httpClient.post("/auth/forgot-password", { email });
  },
};
