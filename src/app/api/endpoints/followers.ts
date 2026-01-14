"use client";

import { UserProfile, FollowStats } from "@/schema/user";
import { handleApiError } from "@/utils/apiErrors";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type RemoveFollowerVars = {
  followerUsername: string;
  profileOwnerUsername: string;
};

export const fetchOwnProfile = async (username: string) => {
  try {
    const [res, statsRes] = await Promise.all([
      fetch(`/api/profile/${username}`, {
        credentials: "include",
      }),
      fetch(`/api/follow/${username}/stats`, {
        credentials: "include",
      }),
    ]);

    const profileData: UserProfile = await res.json();
    const statsData: FollowStats | null = statsRes
      ? await statsRes.json()
      : null;

    return { profile: profileData, stats: statsData };
  } catch (error) {
    handleApiError(error, "Não foi possível carregar os dados do seu perfil");
  }
};

export const fetchUserProfile = async (profileUsername: string) => {
  try {
    const [profileRes, statsRes, isFollowingRes] = await Promise.all([
      fetch(`/api/profile/user/${profileUsername}`, {
        credentials: "include",
      }),
      fetch(`/api/follow/${profileUsername}/stats`, {
        credentials: "include",
      }),
      fetch(`/api/follow/${profileUsername}/is-following`, {
        credentials: "include",
      }),
    ]);

    return {
      profile: await profileRes.json(),
      stats: await statsRes.json(),
      isFollowing: await isFollowingRes.json(),
    };
  } catch (error) {
    handleApiError(
      error,
      "Não foi possível carregar os dados do perfil do usuário"
    );
  }
};

export const removeFollowerFn = async ({
  followerUsername,
}: RemoveFollowerVars) => {
  const res = await fetch(`/api/follow/followers/${followerUsername}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Não foi possível remover o seguidor.");
  }
  const data = await res.json();
  return data;
};

export const useFollow = (
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
      const res = await fetch(`/api/follow/${profileUsername}/follow`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error("Falha ao deixar de seguir o usuário.", {
          cause: new Error(errorData.message),
        });
      }
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

export const searchUserProfile = async (
  username: string
): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`/api/profile/${username}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Falha ao carregar o perfil do usuário.");
    }
    return await res.json();
  } catch (error) {
    handleApiError(error, "Falha ao carregar o perfil do usuário.");
    return null;
  }
};

export const getFollowList = async (
  username: string,
  type: "followers" | "following"
) => {
  const res = await fetch(`/api/follow/${username}/${type}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao carregar a lista.");
  }

  return res.json();
};

export const getModalUsers = async (
  username: string,
  listType: "followers" | "following"
) => {
  const res = await fetch(`/api/follow/${username}/${listType}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao carregar a lista.");
  }
  return res.json();
};

export const unfollowUserApi = async (usernameToUnfollow: string) => {
  const res = await fetch(`/api/follow/${usernameToUnfollow}/follow`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao deixar de seguir.");
  }
};
