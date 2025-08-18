"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useParams } from "next/navigation";
import { UserProfile } from "@/types/profile";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
import { useRouter } from "next/navigation";
export default function OtherProfile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();

  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProfile = useCallback(
    async (profileUsername: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/profile/user/${profileUsername}`);
        if (!res.ok) throw new Error("Erro ao carregar perfil.");
        const data = await res.json();
        setProfile(data);
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

  if (auth.loading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <UserProfileLayout
          profile={profile}
          isLoading={loading}
          error={error}
          isOwnProfile={false}
          onSuccessUpdate={() => {}}
        />
      </main>
    </div>
  );
}
