"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/services/auth";
import { UpdateData } from "@/components/UpdateData";
import { UpdateContacts } from "@/components/UpdateContacts";
import { formatUrl } from "@/utils/urlUtils";
import { formatLastLogin } from "@/utils/dateUtils";
import { UserProfile } from "@/types/users";

export default function Profile() {
  const auth = useAuth();
  const user = auth?.user;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProfile = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/profile/${userId}`);
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
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

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
  }
  return (
    <div className="min-h-screen font-sans">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
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
                      {user?.id && profile && (
                        <UpdateData
                          profile={profile}
                          onSuccess={() => {
                            setUpdating(true);
                            fetchProfile(user.id).finally(() =>
                              setUpdating(false)
                            );
                          }}
                        />
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {updating && (
                        <div className="text-sm text-blue-500 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Atualizando perfil...
                        </div>
                      )}
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
                      {user?.id && profile && (
                        <UpdateContacts
                          profile={profile}
                          onSuccess={() => fetchProfile(user.id)}
                        />
                      )}
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
                            href={formatUrl(profile.steam)}
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
      </main>
    </div>
  );
}
