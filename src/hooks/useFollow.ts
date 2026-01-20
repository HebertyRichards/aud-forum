"use client";

import { useState, useEffect } from "react";
import { followService } from "@/services";
import { toast } from "sonner";

export const useFollowHook = (
  profileUsername: string,
  initialIsFollowing: boolean,
  initialFollowersCount: number
) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  useEffect(() => {
    setFollowersCount(initialFollowersCount);
  }, [initialFollowersCount]);

  const handleFollow = async () => {
    setIsLoading(true);
    setIsFollowing(true);
    setFollowersCount((prev) => prev + 1);

    try {
      await followService.followUser(profileUsername);
    } catch (error) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
      if (error instanceof Error) {
        toast.error("Ocorreu um erro ao tentar seguir o usuário.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    setIsFollowing(false);
    setFollowersCount((prev) => Math.max(0, prev - 1));

    try {
      await followService.unfollowUser(profileUsername);
    } catch (error) {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      if (error instanceof Error) {
        toast.error("Ocorreu um erro ao deixar de seguir o usuário.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    followersCount,
    isLoading,
    handleFollow,
    handleUnfollow,
  };
};
