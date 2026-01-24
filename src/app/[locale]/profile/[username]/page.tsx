"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth";
import { useParams, useRouter } from "next/navigation";
import { UserProfileLayout } from "@/components/profile/UserProfileLayout";
import { useFollowHook } from "@/hooks/useFollow";
import { useFetchUserProfile } from "@/hooks/useFetchUserProfile";
import { useTranslations } from "next-intl";

export default function OtherProfile() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, error, handleSuccessUpdate } =
    useFetchUserProfile(username);
  const t = useTranslations("pages.profile");

  const profile = data?.profile;
  const initialStats = data?.stats;
  const initialIsFollowing = data?.isFollowing;

  const {
    isFollowing,
    followersCount,
    isLoading: isFollowLoading,
    handleFollow,
    handleUnfollow,
  } = useFollowHook(
    username,
    initialIsFollowing ?? false,
    initialStats?.followers_count ?? 0
  );

  useEffect(() => {
    if (auth.loading) return;
    if (!user) {
      router.push("/");
      return;
    }
    if (user.username === username) {
      router.push("/profile");
    }
  }, [user, auth.loading, router, username]);

  if (auth.loading || (isLoading && !data)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">{t("loading")}</p>
      </div>
    );
  }

  const errorMessage =
    error instanceof Error ? error.message : t("error");

  const followState = {
    stats: {
      followers_count: followersCount,
      following_count: initialStats?.following_count ?? 0,
    },
    isFollowing,
    isFollowLoading,
    onFollow: handleFollow,
    onUnfollow: handleUnfollow,
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <UserProfileLayout
          profile={profile ?? null}
          isLoading={isLoading && !data}
          error={error ? errorMessage : null}
          isOwnProfile={false}
          onSuccessUpdate={handleSuccessUpdate}
          followState={followState}
        />
      </main>
    </div>
  );
}
