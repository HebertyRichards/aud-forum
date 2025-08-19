"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { UserProfile, FollowStats } from "@/types/profile";
import { useRouter } from "next/navigation";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";

export default function Profile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProfile = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const [res, statsRes] = await Promise.all([
          fetch(`${API_URL}/profile/${userId}`),
          fetch(`${API_URL}/profile/${userId}/stats`),
        ]);
        if (!res.ok) throw new Error("Erro ao carregar perfil.");
        const data = await res.json();
        setProfile(data);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error: unknown) {
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    if (!auth.loading && !user) {
      router.push("/login");
      return;
    }
    if (user?.id) {
      fetchProfile(user.id);
    } else if (!auth.loading && !user?.id) {
      setLoading(false);
      setError("Não foi possível identificar o usuário.");
    }
  }, [user, auth.loading, router, fetchProfile]);

  const handleSuccessUpdate = () => {
    if (user?.id) {
      setUpdating(true);
      fetchProfile(user.id).finally(() => setUpdating(false));
    }
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">Verificando sessão...</p>
      </div>
    );
  }

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
          stats={stats}
        />
      </main>
    </div>
  );
}
