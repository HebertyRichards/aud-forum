"use client";

import { useFollowHook } from "@/hooks/useFollow";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, UserMinus } from "lucide-react";

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
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        ) : isFollowing ? (
          <>
            <UserMinus className="mr-2 h-4 w-4" /> Deixar de Seguir
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" /> Seguir
          </>
        )}
      </Button>
    </>
  );
}
