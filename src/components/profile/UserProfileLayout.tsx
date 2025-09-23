"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, ChevronDown } from "lucide-react";
import { UserProfileLayoutProps } from "@/types/profile";
import { FollowListModal } from "./FollowerListModal";
import { StatisticsTab } from "./StatisticsTab";
import { TopicsTab } from "./TopicsTab";
import { FollowerList } from "./FollowerList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileContactTab } from "./ProfileContactTab";
import { ProfileInfoTab } from "./ProfileInfoTab";
import { UserProfileSidebar } from "./UserProfileSidebar";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

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
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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

const navItems = [
  { value: "perfil", label: "Perfil" },
  { value: "estatisticas", label: "Estatísticas" },
  { value: "seguidores", label: "Seguidores" },
  { value: "publicacoes", label: "Tópicos Criados" },
  { value: "contato", label: "Contato" },
];

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
  const [activeTab, setActiveTab] = useState("perfil");
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const currentLabel = navItems.find((item) => item.value === activeTab)?.label;

  const renderNavigation = () => {
    if (isMobile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-between border border-slate-600 bg-slate-700">
              {currentLabel}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full md:w-56" align="start">
            {navItems.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onSelect={() => setActiveTab(item.value)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <TabsList className="border border-slate-700 bg-slate-800">
        {navItems.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="text-white data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    );
  };

  return (
    <>
      {modalState.isOpen && profile?.username && (
        <FollowListModal
          username={profile.username}
          listType={modalState.listType!}
          onClose={closeModal}
          isOwnProfile={isOwnProfile}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">
            Tudo sobre {profile?.username}
          </h1>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {renderNavigation()}
            <div className="mt-4">
              {activeTab === "perfil" && (
                <ProfileInfoTab
                  profile={profile}
                  isOwnProfile={isOwnProfile}
                  isUpdating={isUpdating}
                  onSuccessUpdate={onSuccessUpdate}
                />
              )}
              {activeTab === "estatisticas" && (
                <>
                  {profile?.username && (
                    <StatisticsTab username={profile.username} />
                  )}
                </>
              )}
              {activeTab === "seguidores" && (
                <Card className="border-slate-700 bg-slate-800 text-white">
                  <CardHeader>
                    <CardTitle>Seguidores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.username && (
                      <FollowerList
                        username={profile.username}
                        type="followers"
                      />
                    )}
                  </CardContent>
                </Card>
              )}
              {activeTab === "publicacoes" && (
                <>
                  {profile?.username && (
                    <TopicsTab username={profile.username} />
                  )}
                </>
              )}
              {activeTab === "contato" && (
                <ProfileContactTab
                  profile={profile}
                  isOwnProfile={isOwnProfile}
                  onSuccessUpdate={onSuccessUpdate}
                />
              )}
            </div>
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
