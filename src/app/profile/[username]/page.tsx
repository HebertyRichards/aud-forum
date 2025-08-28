"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useParams, useRouter } from "next/navigation";
import { UserProfile, FollowStats } from "@/types/profile";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
export default function OtherProfile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();

  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProfile = useCallback(
    async (profileUsername: string) => {
      setLoading(true);
      setError(null);
      try {
        const fetchOptions = { credentials: "include" as RequestCredentials };
        const [profileRes, statsRes, isFollowingRes] = await Promise.all([
          fetch(`${API_URL}/profile/user/${profileUsername}`),
          fetch(`${API_URL}/profile/${profileUsername}/stats`),
          fetch(
            `${API_URL}/profile/${profileUsername}/is-following`,
            fetchOptions
          ),
        ]);
        if (!profileRes.ok) {
          throw new Error("Erro ao carregar perfil.");
        }
        const profileData: UserProfile = await profileRes.json();
        setProfile(profileData);

        if (statsRes.ok) {
          const statsData: FollowStats = await statsRes.json();
          setStats(statsData);
        } else {
          setStats({ followers_count: 0, following_count: 0 });
        }

        if (isFollowingRes.ok) {
          const isFollowingData = await isFollowingRes.json();
          setIsFollowing(isFollowingData.isFollowing);
        } else {
          setIsFollowing(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu uma falha inesperada.");
        }
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    if (auth.loading) {
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }
    if (typeof username === "string" && user.username === username) {
      router.push("/profile");
      return;
    }
    if (typeof username === "string") {
      fetchProfile(username);
    } else {
      setLoading(false);
      setError("Nome de usuário inválido.");
    }
  }, [user, auth.loading, router, fetchProfile, username]);

  const handleApiAction = async (method: "POST" | "DELETE") => {
    if (!profile?.username) {
      alert("Ação não disponível: nome de usuário não encontrado.");
      return;
    }
    setIsFollowLoading(true);
    try {
      const res = await fetch(`${API_URL}/profile/${profile.username}/follow`, {
        method,
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Ação falhou." }));
        throw new Error(errorData.message);
      }
      if (method === "POST") {
        setIsFollowing(true);
        setStats((prev) => ({
          followers_count: (prev?.followers_count ?? 0) + 1,
          following_count: prev?.following_count ?? 0,
        }));
      } else {
        setIsFollowing(false);
        setStats((prev) => ({
          followers_count: Math.max(0, (prev?.followers_count ?? 0) - 1),
          following_count: prev?.following_count ?? 0,
        }));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(
          error.message ||
            "Não foi possível realizar essa ação, tente novamente"
        );
      } else {
        alert("Ocorreu uma falha inesperada.");
      }
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleFollow = () => handleApiAction("POST");
  const handleUnfollow = () => handleApiAction("DELETE");

  if (auth.loading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">Carregando...</p>
      </div>
    );
  }

  const followState = {
    stats,
    isFollowing,
    isFollowLoading,
    onFollow: handleFollow,
    onUnfollow: handleUnfollow,
  };

  return (
    <div className="min-h-screen font-sans">
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
