import { UserStats } from "@/schema/user";
import { TopicSummary } from "@/schema/forum";
import { httpClient } from "./core/httpClient";
import { handleError } from "@/utils/errorsApi";

export interface UpdateProfileData {
  username: string;
  newEmail: string;
}

export interface UpdateContactsPayload {
  id?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  discord?: string;
  steam?: string;
}

export interface UpdateProfileDataPayload {
  id?: string;
  username?: string;
  gender?: string;
  birthdate?: string;
  location?: string;
}

export interface AvatarResponse {
  avatar_url: string;
}

export const profileService = {
  async updateProfile(data: UpdateProfileData): Promise<void> {
    try {
      await httpClient.patch("/profile/update-data", data);
    } catch (error) {
      throw handleError(error, "Failed to update profile");
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    try {
      await httpClient.patch("/auth/update-password", { newPassword });
    } catch (error) {
      throw handleError(error, "Failed to update password");
    }
  },

  async deleteAccount(password: string): Promise<void> {
    try {
      await httpClient.delete("/auth/delete-account", { password });
    } catch (error) {
      throw handleError(error, "Failed to delete account");
    }
  },

  async uploadAvatar(file: File): Promise<AvatarResponse> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await httpClient.patch<AvatarResponse>("/profile/user/avatar", formData);
      if (!response) throw new Error("Failed to upload avatar");
      return response;
    } catch (error) {
      throw handleError(error, "Failed to upload avatar");
    }
  },

  async deleteAvatar(): Promise<AvatarResponse> {
    try {
      const response = await httpClient.delete<AvatarResponse>("/profile/user/avatar");
      if (!response) throw new Error("Failed to delete avatar");
      return response;
    } catch (error) {
      throw handleError(error, "Failed to delete avatar");
    }
  },

  async updateContacts(payload: UpdateContactsPayload): Promise<unknown> {
    try {
      return await httpClient.put("/profile/update", payload);
    } catch (error) {
      throw handleError(error, "Failed to update contacts");
    }
  },

  async updateProfileData(payload: UpdateProfileDataPayload): Promise<unknown> {
    try {
      return await httpClient.put("/profile/update", payload);
    } catch (error) {
      throw handleError(error, "Failed to update profile data");
    }
  },

  async getUserStats(username: string): Promise<UserStats> {
    try {
      const response = await httpClient.get<UserStats>(`/statistic/profile/${username}/stats`);
      if (!response) throw new Error("Failed to get user stats");
      return response;
    } catch (error) {
      throw handleError(error, "Failed to get user stats");
    }
  },

  async getTopicsByAuthor(username: string): Promise<TopicSummary[]> {
    try {
      const response = await httpClient.get<TopicSummary[]>(`/statistic/profile/${username}/topics`);
      return response ?? [];
    } catch (error) {
      throw handleError(error, "Failed to get topics by author");
    }
  },
};
