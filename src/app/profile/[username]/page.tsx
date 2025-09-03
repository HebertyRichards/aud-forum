"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useParams, useRouter } from "next/navigation";
import { UserProfile, FollowStats } from "@/types/profile";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
import axios from "axios";
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

  const fetchProfile = useCallback(async (profileUsername: string) => {
    setLoading(true);
    setError(null);
    try {
      const axiosOptions = { withCredentials: true };
      const [profileRes, statsRes, isFollowingRes] = await Promise.all([
        axios.get(`/api/profile/user/${profileUsername}`),
        axios.get(`/api/follow/${profileUsername}/stats`).catch(() => null),
        axios
          .get(`/api/follow/${profileUsername}/is-following`, axiosOptions)
          .catch(() => null),
      ]);
      const profileData: UserProfile = profileRes.data;
      setProfile(profileData);
      if (statsRes) {
        const statsData: FollowStats = statsRes.data;
        setStats(statsData);
      } else {
        setStats({ followers_count: 0, following_count: 0 });
      }

      if (isFollowingRes) {
        const isFollowingData = isFollowingRes.data;
        setIsFollowing(isFollowingData.isFollowing);
      } else {
        setIsFollowing(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Erro ao carregar perfil.");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu uma falha inesperada.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
      const url = `/api/follow/${profile.username}/follow`;
      const config = { withCredentials: true };

      if (method === "POST") {
        await axios.post(url, {}, config);
      } else {
        await axios.delete(url, config);
      }
      setIsFollowing(method === "POST");
      setStats((prev) => {
        const currentFollowers = prev?.followers_count ?? 0;
        const change = method === "POST" ? 1 : -1;
        return {
          followers_count: Math.max(0, currentFollowers + change),
          following_count: prev?.following_count ?? 0,
        };
      });
    } catch (error: unknown) {
      let errorMessage = "Não foi possível realizar essa ação, tente novamente";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
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
