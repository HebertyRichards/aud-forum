"use client";
import { useFollow } from "@/app/api/endpoints/followers";

export const useFollowHook = (
  profileUsername: string,
  initialIsFollowing: boolean,
  initialFollowersCount: number
) => {
  const {
    isFollowing,
    followersCount,
    isLoading,
    handleFollow,
    handleUnfollow,
  } = useFollow(profileUsername, initialIsFollowing, initialFollowersCount);

  return {
    isFollowing,
    followersCount,
    isLoading,
    handleFollow,
    handleUnfollow,
  };
};
