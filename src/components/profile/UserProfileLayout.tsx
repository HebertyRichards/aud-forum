"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle } from "lucide-react";
import { UserProfileLayoutProps } from "@/types/profile";
import { FollowListModal } from "./FollowerListModal";
import { StatisticsTab } from "./StatisticsTab";
import { TopicsTab } from "./TopicsTab";
import { FollowerList } from "./FollowerList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileContactTab } from "./ProfileContactTab";
import { ProfileInfoTab } from "./ProfileInfoTab";
import { UserProfileSidebar } from "./UserProfileSidebar";

const ProfileStateDisplay = ({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: string | null;
}) => {
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

  return null;
};

export function UserProfileLayout({
  profile,
  isLoading,
  isUpdating,
  error,
  isOwnProfile,
  onSuccessUpdate,
  followState,
}: UserProfileLayoutProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    listType: "followers" | "following" | null;
  }>({ isOpen: false, listType: null });

  const openModal = (listType: "followers" | "following") => {
    if (profile?.username) {
      setModalState({ isOpen: true, listType });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, listType: null });
  };

  if (isLoading || error) {
    return <ProfileStateDisplay isLoading={isLoading} error={error} />;
  }

  return (
    <>
      {modalState.isOpen && profile?.username && (
        <FollowListModal
          username={profile.username}
          listType={modalState.listType!}
          onClose={closeModal}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">
            Tudo sobre {profile?.username}
          </h1>
          <Tabs defaultValue="perfil" className="w-full">
            <TabsList className="border border-gray-700 bg-white dark:bg-gray-800">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
              <TabsTrigger value="seguidores">Seguidores</TabsTrigger>
              <TabsTrigger value="publicacoes">Tópicos Criados</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
            </TabsList>
            <ProfileInfoTab
              profile={profile}
              isOwnProfile={isOwnProfile}
              isUpdating={isUpdating}
              onSuccessUpdate={onSuccessUpdate}
            />
            <TabsContent value="estatisticas" className="mt-4">
              {profile?.username && (
                <StatisticsTab username={profile.username} />
              )}
            </TabsContent>
            <TabsContent value="seguidores" className="mt-4">
              <Card className="border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Seguidores</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.username && (
                    <FollowerList userId={profile.username} type="followers" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="publicacoes" className="mt-4">
              {profile?.username && <TopicsTab username={profile.username} />}
            </TabsContent>
            <ProfileContactTab
              profile={profile}
              isOwnProfile={isOwnProfile}
              onSuccessUpdate={onSuccessUpdate}
            />
          </Tabs>
        </main>
        <UserProfileSidebar
          profile={profile}
          isOwnProfile={isOwnProfile}
          followState={followState}
          onOpenModal={openModal}
        />
      </div>
    </>
  );
}
