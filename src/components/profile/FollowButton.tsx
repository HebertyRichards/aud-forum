"use client";

import { useFollowHook } from "@/hooks/useFollow";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, UserMinus } from "lucide-react";
import { useTranslations } from "next-intl";

interface FollowButtonProps {
  profileUsername: string;
  isFollowing: boolean;
  followersCount: number;
}

export function FollowButton({
  profileUsername,
  isFollowing: initialIsFollowing,
  followersCount: initialFollowersCount,
}: FollowButtonProps) {
  const { isFollowing, isLoading, handleFollow, handleUnfollow } =
    useFollowHook(profileUsername, initialIsFollowing, initialFollowersCount);
  const t = useTranslations("profile");
  const handleClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className={`w-full transition-colors ${
          isFollowing
            ? "dark:bg-gray-600 dark:hover:bg-gray-700 bg-slate-200 hover:bg-slate-100"
            : "bg-blue-500 hover:bg-blue-400 dark:hover:bg-blue-600"
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        ) : isFollowing ? (
          <>
            <UserMinus className="mr-2 h-4 w-4" /> {t("unfollow")}
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" /> {t("follow")}
          </>
        )}
      </Button>
    </>
  );
}
