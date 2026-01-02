"use client";
import { useState, useEffect } from "react";

export const useFollow = (
  profileUsername: string,
  initialIsFollowing: boolean,
  initialFollowersCount: number
) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  useEffect(() => {
    setFollowersCount(initialFollowersCount);
  }, [initialFollowersCount]);

  const handleFollow = async () => {
    setIsLoading(true);
    setError(null);
    setIsFollowing(true);
    setFollowersCount((prev) => prev + 1);

    try {
      const res = await fetch(`/api/follow/${profileUsername}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Falha ao seguir o usuário.");
      }
    } catch (error: unknown) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro ao tentar seguir o usuário.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    setError(null);
    setIsFollowing(false);
    setFollowersCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await fetch(`/api/follow/${profileUsername}/follow`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Falha ao deixar de seguir o usuário."
        );
      }
    } catch (error: unknown) {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro ao deixar de seguir o usuário.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    followersCount,
    isLoading,
    error,
    handleFollow,
    handleUnfollow,
  };
};
