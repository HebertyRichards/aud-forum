import { UserWithProfile } from "@/types/autentication";
import { httpClient } from "./core/httpClient";
import { handleError } from "@/utils/errorsApi";

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
    try {
      const response = await httpClient.get<UserWithProfile>("/auth/session");
      if (!response) {
        throw new Error("Failed to get session");
      }
      return response;
    } catch (error) {
      throw handleError(error, "Failed to get session");
    }
  },

  async login(credentials: LoginCredentials) {
    try {
      return await httpClient.post("/auth/login", credentials);
    } catch (error) {
      throw handleError(error, "Failed to login");
    }
  },

  async register(data: RegisterData) {
    try {
      return await httpClient.post("/auth/register", data);
    } catch (error) {
      throw handleError(error, "Failed to register");
    }
  },

  async logout(): Promise<void> {
    try {
      await httpClient.post("/auth/logout", {});
    } catch (error) {
      throw handleError(error, "Failed to logout");
    }
  },

  async updatePassword(data: UpdatePasswordData) {
    try {
      return await httpClient.put("/auth/change-password", data);
    } catch (error) {
      throw handleError(error, "Failed to update password");
    }
  },

  async forgotPassword(email: string) {
    try {
      return await httpClient.post("/auth/forgot-password", { email });
    } catch (error) {
      throw handleError(error, "Failed to send forgot password email");
    }
  },
};
