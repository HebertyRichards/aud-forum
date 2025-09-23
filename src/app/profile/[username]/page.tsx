"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useParams, useRouter } from "next/navigation";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
import { useFollow } from "@/hooks/useFollow";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function OtherProfile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const queryClient = useQueryClient();

  const fetchUserProfile = async (profileUsername: string) => {
    try {
      const axiosOptions = { withCredentials: true };
      const [profileRes, statsRes, isFollowingRes] = await Promise.all([
        axios.get(`/api/profile/user/${profileUsername}`),
        axios.get(`/api/follow/${profileUsername}/stats`),
        axios.get(`/api/follow/${profileUsername}/is-following`, axiosOptions),
      ]);

      return {
        profile: profileRes.data,
        stats: statsRes.data,
        isFollowing: isFollowingRes.data.isFollowing,
      };
    } catch (error: unknown) {
      let errorMessage = "Ocorreu uma falha inesperada ao carregar o perfil.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => fetchUserProfile(username),
    enabled: !!username && !!user && user.username !== username,
    staleTime: 5 * 60 * 1000,
  });

  const profile = data?.profile;
  const initialStats = data?.stats;
  const initialIsFollowing = data?.isFollowing;

  const {
    isFollowing,
    followersCount,
    isLoading: isFollowLoading,
    handleFollow,
    handleUnfollow,
  } = useFollow(
    username,
    initialIsFollowing ?? false,
    initialStats?.followers_count ?? 0
  );

  useEffect(() => {
    if (auth.loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.username === username) {
      router.push("/profile");
    }
  }, [user, auth.loading, router, username]);

  const handleSuccessUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
  };

  if (auth.loading || (isLoading && !data)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">Carregando...</p>
      </div>
    );
  }

  const errorMessage =
    error instanceof Error ? error.message : "Falha ao carregar o perfil.";

  const followState = {
    stats: {
      followers_count: followersCount,
      following_count: initialStats?.following_count ?? 0,
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
          isLoading={isLoading && !data}
          error={error ? errorMessage : null}
          isOwnProfile={false}
          onSuccessUpdate={handleSuccessUpdate}
          followState={followState}
        />
      </main>
    </div>
  );
}
