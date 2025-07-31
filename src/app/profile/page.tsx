"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, UserX } from "lucide-react";
import { useAuth } from "@/services/auth";

interface UserProfile {
  username: string;
  gender?: string;
  birthdate?: string;
  location?: string;
  website?: string;
  joined_at?: string;
  last_login?: string;
  total_posts?: number;
  avatarUrl?: string;
  role?: string;
}

export default function Profile() {
  const auth = useAuth();
  const user = auth?.user;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function fetchProfile(userId: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/profile/${userId}`);
      if (!res.ok) throw new Error("Erro ao carregar perfil.");
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user]);

  function formatLastLogin(dateStr?: string) {
    if (!dateStr) return "--";

    const date = new Date(dateStr);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("pt-BR");
  }
  return (
    <div className="min-h-screen font-sans">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
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
                <TabsTrigger value="grupos">Grupos</TabsTrigger>
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
                      <span className="font-semibold">Data de nascimento:</span>
                      <span>{formatLastLogin(profile?.birthdate)}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Data de inscrição:</span>
                      <span>{formatLastLogin(profile?.joined_at)}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Último login:</span>
                      <span>{formatLastLogin(profile?.last_login)}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Localização:</span>
                      <span>{profile?.location || "--"}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <aside className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-blue-400">
              <a href="#" className="hover:underline flex items-center gap-1">
                <UserPlus size={16} /> Adicionar amigo(a)
              </a>
              <a href="#" className="hover:underline flex items-center gap-1">
                <UserX size={16} /> Adicionar como ignorado(a)
              </a>
            </div>
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
                  <AvatarFallback>{profile?.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 w-full mb-4">
                  Seguir
                </Button>
                <div className="text-sm">
                  <span className="font-semibold">Rank: </span>
                  <span className="text-yellow-400 font-bold">
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
      </main>
    </div>
  );
}
