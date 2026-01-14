"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
import { useFetchOwnProfile } from "@/hooks/useFetchOwnProfile";

export default function Profile() {
  const auth = useAuth();
  const {
    profile: data,
    isLoading,
    isFetching,
    error,
    handleSuccessUpdate,
  } = useFetchOwnProfile();

  if (auth.loading || (isLoading && !data)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">
          {auth.loading ? "Verificando sessão..." : "Carregando perfil..."}
        </p>
      </div>
    );
  }

  const errorMessage =
    error instanceof Error ? error.message : "Ocorreu uma falha inesperada.";

  const followState = {
    stats: data?.stats,
  };

  return (
    <div className="min-h-screen font-sans text-white">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <UserProfileLayout
          profile={data?.profile ?? null}
          isLoading={isLoading && !data}
          isUpdating={isFetching && !!data}
          error={error ? errorMessage : null}
          isOwnProfile={true}
          onSuccessUpdate={handleSuccessUpdate}
          followState={followState}
        />
      </main>
    </div>
  );
}
