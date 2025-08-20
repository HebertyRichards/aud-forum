// app/perfil/[username]/page.tsx
"use client";

<<<<<<< HEAD
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useParams, useRouter } from "next/navigation";
import { UserProfile, FollowStats, UserPreview } from "@/types/profile";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
export default function OtherProfile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();
=======
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatLastLogin } from "@/utils/dateUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Facebook,
  Instagram,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { FaDiscord, FaSteam } from "react-icons/fa";
import { UserProfile } from "@/types/users";
import { formatUrl } from "@/utils/urlUtils";
>>>>>>> parent of 018768f (Merge pull request #8 from HebertyRichards/dev)

export default function OtherProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
<<<<<<< HEAD
        const res = await fetch(`${API_URL}/profile/user/${profileUsername}`);
        if (!res.ok) {
          throw new Error("Erro ao carregar perfil.");
        }
        const data: UserProfile = await res.json();
=======
        const res = await fetch(`${API_URL}/profile/user/${username}`);
        if (!res.ok) throw new Error("Erro ao carregar perfil.");
        const data = await res.json();
>>>>>>> parent of 018768f (Merge pull request #8 from HebertyRichards/dev)
        setProfile(data);

        if (data && data.id && user?.id) {
          const [statsRes, followersRes] = await Promise.all([
            fetch(`${API_URL}/profile/${data.id}/stats`),
            fetch(`${API_URL}/profile/${data.id}/followers`),
          ]);
          if (statsRes.ok) {
            const statsData: FollowStats = await statsRes.json();
            setStats(statsData);
          }

          if (followersRes.ok) {
            const followersData: UserPreview[] = await followersRes.json();
            const userIsFollower = followersData.some(
              (follower) => follower.id === user.id
            );
            setIsFollowing(userIsFollower);
          }
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
<<<<<<< HEAD
    },
    [API_URL, user?.id]
  );
=======
    }
>>>>>>> parent of 018768f (Merge pull request #8 from HebertyRichards/dev)

    if (username) fetchProfile();
  }, [username, API_URL]);

<<<<<<< HEAD
  const handleApiAction = async (method: "POST" | "DELETE") => {
    if (!profile?.id) {
      alert("Ação não disponível: ID do usuário não encontrado.");
      return;
    }
    setIsFollowLoading(true);
    try {
      const res = await fetch(`${API_URL}/profile/${profile.id}/follow`, {
        method,
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Ação falhou.");
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
        alert(error.message);
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
=======
  function formatDate(dateStr?: string) {
    if (!dateStr) return "--";

    const date = new Date(dateStr);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function getRoleColor(role?: string) {
    switch (role?.toLowerCase()) {
      case "visitante":
        return "text-green-500";
      case "partner":
        return "text-yellow-500";
      case "membro":
        return "text-blue-500";
      case "leader":
        return "text-pink-500";
      case "fundador":
        return "text-red-500";
      case "desenvolvedor":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
>>>>>>> parent of 018768f (Merge pull request #8 from HebertyRichards/dev)
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
<<<<<<< HEAD
        <UserProfileLayout
          profile={profile}
          isLoading={loading || auth.loading}
          error={error}
          isOwnProfile={false}
          onSuccessUpdate={() => fetchProfile(username as string)}
          followState={followState}
        />
=======
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
            <p>Carregando perfil...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 flex flex-col items-center py-6">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-4">
                Tudo sobre {profile?.username}
              </h1>
              <Tabs defaultValue="perfil" className="w-full">
                <TabsList className="border border-gray-700 bg-white dark:bg-gray-800">
                  <TabsTrigger value="perfil">Perfil</TabsTrigger>
                  <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
                  <TabsTrigger value="amigos">Amigos</TabsTrigger>
                  <TabsTrigger value="contato">Contato</TabsTrigger>
                </TabsList>
                <TabsContent value="perfil" className="mt-4">
                  <Card className="border-gray-700 bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Sobre</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between py-2">
                        <span className="font-semibold">Gênero:</span>
                        <span>{profile?.gender || "--"}</span>
                      </div>
                      <Separator className="bg-gray-600" />
                      <div className="flex justify-between py-2">
                        <span className="font-semibold">Mensagens:</span>
                        <span>{profile?.total_posts ?? "--"}</span>
                      </div>
                      <Separator className="bg-gray-600" />
                      <div className="flex justify-between py-2">
                        <span className="font-semibold">
                          Data de nascimento:
                        </span>
                        <span>{formatDate(profile?.birthdate)}</span>
                      </div>
                      <Separator className="bg-gray-600" />
                      <div className="flex justify-between py-2">
                        <span className="font-semibold">
                          Data de inscrição:
                        </span>
                        <span>{formatDate(profile?.joined_at)}</span>
                      </div>
                      <Separator className="bg-gray-600" />
                      <div className="flex justify-between py-2">
                        <span className="font-semibold">Último login:</span>
                        <span>
                          {formatLastLogin(profile?.last_login ?? null)}
                        </span>
                      </div>
                      <Separator className="bg-gray-600" />
                      <div className="flex justify-between py-2">
                        <span className="font-semibold">Localização:</span>
                        <span>{profile?.location || "--"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="contato" className="mt-4">
                  <Card className="border-gray-700 bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Contatos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between py-2 items-center">
                        <span className="font-semibold">Website:</span>
                        {profile?.website ? (
                          <a
                            href={formatUrl(profile.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
                          >
                            <Globe size={20} />
                          </a>
                        ) : (
                          <span>--</span>
                        )}
                      </div>
                      <Separator className="bg-gray-600" />

                      <div className="flex justify-between py-2 items-center">
                        <span className="font-semibold">Facebook:</span>
                        {profile?.facebook ? (
                          <a
                            href={formatUrl(profile.facebook)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
                          >
                            <Facebook size={20} />
                          </a>
                        ) : (
                          <span>--</span>
                        )}
                      </div>
                      <Separator className="bg-gray-600" />

                      <div className="flex justify-between py-2 items-center">
                        <span className="font-semibold">Instagram:</span>
                        {profile?.instagram ? (
                          <a
                            href={formatUrl(profile.instagram)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-200 hover:text-pink-500"
                          >
                            <Instagram size={20} />
                          </a>
                        ) : (
                          <span>--</span>
                        )}
                      </div>
                      <Separator className="bg-gray-600" />

                      <div className="flex justify-between py-2 items-center">
                        <span className="font-semibold">Discord:</span>
                        {profile?.discord ? (
                          <a
                            href={formatUrl(profile.discord)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-200 hover:text-indigo-500"
                          >
                            <FaDiscord size={20} />
                          </a>
                        ) : (
                          <span>--</span>
                        )}
                      </div>
                      <Separator className="bg-gray-600" />

                      <div className="flex justify-between py-2 items-center">
                        <span className="font-semibold">Steam:</span>
                        {profile?.steam ? (
                          <a
                            href={profile.steam}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-700"
                          >
                            <FaSteam size={20} />
                          </a>
                        ) : (
                          <span>--</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <aside className="space-y-6">
              <Card className="border-gray-700 text-center bg-white dark:bg-gray-800">
                <CardContent className="p-6 flex flex-col items-center">
                  <h2 className="text-xl font-bold text-blue-400 hover:underline cursor-pointer mb-4">
                    {profile?.username}
                  </h2>
                  <Avatar className="w-24 h-24 mb-4 border-2 border-gray-500">
                    <AvatarImage
                      src={profile?.avatarUrl || undefined}
                      alt={profile?.username}
                    />
                    <AvatarFallback>
                      {profile?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 w-full mb-4">
                    Seguir
                  </Button>
                  <div className="text-sm">
                    <span className="font-semibold">Rank: </span>
                    <span
                      className={`${getRoleColor(profile?.role)} font-bold`}
                    >
                      {profile?.role || "--"}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-base">
                    Amigo(a)s de {profile?.username}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Nenhum amigo para mostrar.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
>>>>>>> parent of 018768f (Merge pull request #8 from HebertyRichards/dev)
      </main>
    </div>
  );
}
