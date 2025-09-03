"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { UserProfile, FollowStats } from "@/types/profile";
import { useRouter } from "next/navigation";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
import axios from "axios";

export default function Profile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(
    async (userId: string, username: string) => {
      if (!updating) {
        setLoading(true);
      }
      setError(null);
      try {
        const [res, statsRes] = await Promise.all([
          axios.get(`/api/profile/${userId}`),
          axios.get(`/api/follow/${username}/stats`).catch(() => null),
        ]);
        const data: UserProfile = res.data;
        setProfile(data);
        if (statsRes) {
          const statsData: FollowStats = statsRes.data;
          setStats(statsData);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message || "Erro ao carregar o perfil."
          );
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu uma falha inesperada ao carregar o perfil.");
        }
      } finally {
        setLoading(false);
      }
    },
    [updating]
  );

  useEffect(() => {
    if (auth.loading) {
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.id && user.username) {
      fetchProfile(user.id, user.username);
    } else {
      setLoading(false);
      setError("Não foi possível identificar o usuário.");
    }
  }, [user, auth.loading, router, fetchProfile]);

  const handleSuccessUpdate = () => {
    if (user?.id && user.username) {
      setUpdating(true);
      fetchProfile(user.id, user.username).finally(() => setUpdating(false));
    }
  };

  if (auth.loading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">
          {auth.loading ? "Verificando sessão..." : "Carregando perfil..."}
        </p>
      </div>
    );
  }

  const followState = {
    stats,
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <UserProfileLayout
          profile={profile}
          isLoading={loading}
          isUpdating={updating}
          error={error}
          isOwnProfile={true}
          onSuccessUpdate={handleSuccessUpdate}
          followState={followState}
        />
      </main>
    </div>
  );
}
