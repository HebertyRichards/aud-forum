"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useParams, useRouter } from "next/navigation";
import { UserProfile, FollowStats } from "@/types/profile";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
import { useFollow } from "@/hooks/useFollow";
import axios from "axios";

export default function OtherProfile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();

  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialStats, setInitialStats] = useState<FollowStats>({
    followers_count: 0,
    following_count: 0,
  });
  const [initialIsFollowing, setInitialIsFollowing] = useState(false);

  const {
    isFollowing,
    followersCount,
    isLoading: isFollowLoading,
    handleFollow,
    handleUnfollow,
  } = useFollow(
    username as string,
    initialIsFollowing,
    initialStats.followers_count
  );

  const fetchProfile = useCallback(async (profileUsername: string) => {
    setLoading(true);
    setError(null);
    try {
      const axiosOptions = { withCredentials: true };
      const [profileRes, statsRes, isFollowingRes] = await Promise.all([
        axios.get(`/api/profile/user/${profileUsername}`),
        axios.get(`/api/follow/${profileUsername}/stats`),
        axios.get(`/api/follow/${profileUsername}/is-following`, axiosOptions),
      ]);

      setProfile(profileRes.data);
      setInitialStats(statsRes.data);
      setInitialIsFollowing(isFollowingRes.data.isFollowing);
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Ocorreu uma falha inesperada ao carregar o perfil.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth.loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (typeof username === "string") {
      if (user.username === username) {
        router.push("/profile");
      } else {
        fetchProfile(username);
      }
    } else {
      setLoading(false);
      setError("Nome de usuário inválido.");
    }
  }, [user, auth.loading, router, fetchProfile, username]);

  if (auth.loading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">Carregando...</p>
      </div>
    );
  }

  const followState = {
    stats: {
      followers_count: followersCount,
      following_count: initialStats.following_count,
    },
    isFollowing,
    isFollowLoading,
    onFollow: handleFollow,
    onUnfollow: handleUnfollow,
  };

  return (
    <div className="min-h-screen font-sans text-white">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <UserProfileLayout
          profile={profile}
          isLoading={loading || auth.loading}
          error={error}
          isOwnProfile={false}
          onSuccessUpdate={() => fetchProfile(username as string)}
          followState={followState}
        />
      </main>
    </div>
  );
}
