"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { getRoleColor } from "@/utils/colors";
import { useRemoveFollower } from "@/hooks/useRemoveFollower";
import {
  useFollowModalData,
  useUnfollowMutation,
} from "@/hooks/useFollowActions";

interface FollowListModalProps {
  username: string;
  listType: "followers" | "following";
  onClose: () => void;
  isOwnProfile: boolean;
}

export function FollowListModal({
  username,
  listType,
  onClose,
  isOwnProfile,
}: FollowListModalProps) {
  const {
    data: users,
    isLoading,
    error,
  } = useFollowModalData(username, listType);
  const { mutate: unfollow, variables: unfollowingUsername } =
    useUnfollowMutation();
  const { removeFollower, isPending: isRemoving } = useRemoveFollower();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md border-gray-700 bg-slate-800 relative animate-in fade-in-0 zoom-in-95">
        <CardHeader className="text-center">
          <CardTitle className="capitalize text-white">
            {listType === "followers" ? "Seguidores" : "Seguindo"}
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-opacity"
          >
            <X size={24} />
          </button>
        </CardHeader>

        <CardContent className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center p-8 text-red-500">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <p>{error.message}</p>
            </div>
          ) : users?.length ? (
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.username}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-700 text-white"
                >
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-slate-600">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`font-semibold truncate ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.username}
                    </span>
                  </Link>

                  <div className="shrink-0">
                    {isOwnProfile && listType === "followers" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-21.25"
                        onClick={() =>
                          removeFollower({
                            followerUsername: user.username,
                            profileOwnerUsername: username,
                          })
                        }
                        disabled={isRemoving}
                      >
                        {isRemoving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Remover"
                        )}
                      </Button>
                    )}

                    {isOwnProfile && listType === "following" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-30"
                        onClick={() => unfollow(user.username)}
                        disabled={unfollowingUsername === user.username}
                      >
                        {unfollowingUsername === user.username ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Deixar de seguir"
                        )}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 py-4">
              Nenhum usuário encontrado.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
