import { UserProfile, FollowStats } from "@/schema/user";
import { httpClient } from "./core/httpClient";

export interface OwnProfileData {
  profile: UserProfile;
  stats: FollowStats | null;
}

export interface UserProfileData {
  profile: UserProfile;
  stats: FollowStats;
  isFollowing: boolean;
}

export const searchUserProfile = async (username: string): Promise<UserProfile | null> => {
  try {
    const response = await httpClient.get<UserProfile>(`/profile/${username}`);
    return response ?? null;
  } catch {
    return null;
  }
};

export const followService = {
  async getOwnProfile(username: string): Promise<OwnProfileData> {
    const [profile, stats] = await Promise.all([
      httpClient.get<UserProfile>(`/profile/${username}`),
      httpClient.get<FollowStats>(`/follow/${username}/stats`),
    ]);
    return { profile: profile!, stats: stats ?? null };
  },

  async getUserProfile(profileUsername: string): Promise<UserProfileData> {
    const [profile, stats, isFollowing] = await Promise.all([
      httpClient.get<UserProfile>(`/profile/user/${profileUsername}`),
      httpClient.get<FollowStats>(`/follow/${profileUsername}/stats`),
      httpClient.get<boolean>(`/follow/${profileUsername}/is-following`),
    ]);
    return { profile: profile!, stats: stats!, isFollowing: isFollowing ?? false };
  },

  async followUser(username: string): Promise<void> {
    await httpClient.post(`/follow/${username}/follow`, {});
  },

  async unfollowUser(username: string): Promise<void> {
    await httpClient.delete(`/follow/${username}/follow`);
  },

  async removeFollower(followerUsername: string): Promise<unknown> {
    return httpClient.delete(`/follow/followers/${followerUsername}`);
  },

  async getFollowList(
    username: string,
    type: "followers" | "following"
  ): Promise<UserProfile[]> {
    const response = await httpClient.get<UserProfile[]>(`/follow/${username}/${type}`);
    return response ?? [];
  },
  
  async searchUserProfile(username: string): Promise<UserProfile | null> {
    try {
      const response = await httpClient.get<UserProfile>(`/profile/${username}`);
      return response ?? null;
    } catch {
      return null;
    }
  },
};
