import { UserStats } from "@/schema/user";
import { TopicSummary } from "@/schema/forum";
import { httpClient } from "./core/httpClient";

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
    await httpClient.patch("/profile/update-data", data);
  },

  async updatePassword(newPassword: string): Promise<void> {
    await httpClient.patch("/auth/update-password", { newPassword });
  },

  async deleteAccount(password: string): Promise<void> {
    await httpClient.delete("/auth/delete-account", { password });
  },

  async uploadAvatar(file: File): Promise<AvatarResponse> {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await httpClient.patch<AvatarResponse>("/profile/user/avatar", formData);
    if (!response) throw new Error("Failed to upload avatar");
    return response;
  },

  async deleteAvatar(): Promise<AvatarResponse> {
    const response = await httpClient.delete<AvatarResponse>("/profile/user/avatar");
    if (!response) throw new Error("Failed to delete avatar");
    return response;
  },

  async updateContacts(payload: UpdateContactsPayload): Promise<unknown> {
    return httpClient.put("/profile/update", payload);
  },

  async updateProfileData(payload: UpdateProfileDataPayload): Promise<unknown> {
    return httpClient.put("/profile/update", payload);
  },

  async getUserStats(username: string): Promise<UserStats> {
    const response = await httpClient.get<UserStats>(`/statistic/profile/${username}/stats`);
    if (!response) throw new Error("Failed to get user stats");
    return response;
  },

  async getTopicsByAuthor(username: string): Promise<TopicSummary[]> {
    const response = await httpClient.get<TopicSummary[]>(`/statistic/profile/${username}/topics`);
    return response ?? [];
  },
};
