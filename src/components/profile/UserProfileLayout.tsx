"use client";

import React from "react";
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
import { UserProfileLayoutProps } from "@/types/profile";
import { formatUrl } from "@/utils/urlUtils";
import { formatLastLogin } from "@/utils/dateUtils";
import { UpdateData } from "./UpdateData";
import { UpdateContacts } from "./UpdateContacts";
import { UpdateAvatar } from "./UpdateAvatar";
import { getRoleColor } from "@/utils/colors";
import { formatDate } from "@/utils/dateUtils";

export function UserProfileLayout({
  profile,
  isLoading,
  isUpdating,
  error,
  isOwnProfile,
  onSuccessUpdate,
}: UserProfileLayoutProps) {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 flex flex-col items-center py-6">
        <AlertTriangle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
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
                {isOwnProfile && profile && (
                  <UpdateData profile={profile} onSuccess={onSuccessUpdate} />
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isUpdating && (
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
                  <span className="font-semibold">Data de nascimento:</span>
                  <span>{formatDate(profile?.birthdate)}</span>
                </div>
                <Separator className="bg-gray-600" />
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Data de inscrição:</span>
                  <span>{formatDate(profile?.joined_at)}</span>
                </div>
                <Separator className="bg-gray-600" />
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Último login:</span>
                  <span>{formatLastLogin(profile?.last_login ?? null)}</span>
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
                {isOwnProfile && profile && (
                  <UpdateContacts
                    profile={profile}
                    onSuccess={onSuccessUpdate}
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
            <div className="relative group mb-4">
              <Avatar className="w-24 h-24 border-2 border-gray-500">
                <AvatarImage
                  src={profile?.avatar_url || undefined}
                  alt={profile?.username}
                  key={profile?.avatar_url}
                />
                <AvatarFallback>{profile?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              {isOwnProfile && <UpdateAvatar onSuccess={onSuccessUpdate} />}
            </div>
            {!isOwnProfile && (
              <Button className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 w-full mb-4">
                Seguir
              </Button>
            )}
            <div className="text-sm">
              <span className="font-semibold">Rank: </span>
              <span className={`${getRoleColor(profile?.role)} font-bold`}>
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
            <p className="text-sm text-gray-400">Nenhum amigo para mostrar.</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
