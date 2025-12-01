"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { UserProfile, FollowStats } from "@/types/profile";
import { useRouter } from "next/navigation";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchOwnProfile = async (username: string) => {
    try {
      const [res, statsRes] = await Promise.all([
        axios.get(`/api/profile/${username}`),
        axios.get(`/api/follow/${username}/stats`).catch(() => null),
      ]);

      const profileData: UserProfile = res.data;
      const statsData: FollowStats | null = statsRes ? statsRes.data : null;

      return { profile: profileData, stats: statsData };
    } catch (error: unknown) {
      let errorMessage = "Não foi possível carregar os dados do seu perfil.";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["ownProfile", user?.username],
    queryFn: () => fetchOwnProfile(user?.username as string),
    enabled: !!user?.username && !!user.username,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (auth.loading) return;
    if (!user) {
      router.push("/");
    }
  }, [user, auth.loading, router]);

  const handleSuccessUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["ownProfile", user?.username] });
  };

  if (auth.loading || (isLoading && !data)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">
          {auth.loading ? "Verificando sessão..." : "Carregando perfil..."}
        </p>
      </div>
    );
  }

  const errorMessage =
    error instanceof Error ? error.message : "Ocorreu uma falha inesperada.";

  const followState = {
    stats: data?.stats,
  };

  return (
    <div className="min-h-screen font-sans text-white">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <UserProfileLayout
          profile={data?.profile ?? null}
          isLoading={isLoading && !data}
          isUpdating={isFetching && !!data}
          error={error ? errorMessage : null}
          isOwnProfile={true}
          onSuccessUpdate={handleSuccessUpdate}
          followState={followState}
        />
      </main>
    </div>
  );
}
