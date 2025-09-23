"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, AlertTriangle } from "lucide-react";
import { UserPreview, FollowListModalProps } from "@/types/profile";
import axios from "axios";
import { Button } from "../ui/button";
import { useRemoveFollower } from "@/hooks/useRemoveFollower";
import { toast } from "sonner";
import { getRoleColor } from "@/utils/colors";

const fetchModalUsers = async (
  username: string,
  listType: "followers" | "following"
) => {
  try {
    const { data } = await axios.get<UserPreview[]>(
      `/api/follow/${username}/${listType}`
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Falha ao carregar a lista de usuários.");
  }
};

export function FollowListModal({
  username,
  listType,
  onClose,
  isOwnProfile,
}: FollowListModalProps) {
  const queryClient = useQueryClient();
  const { removeFollower, isPending: isRemoving } = useRemoveFollower();
  const [mutatingUsername, setMutatingUsername] = useState<string | null>(null);

  const handleRemoveClick = (followerUsername: string) => {
    removeFollower({
      followerUsername,
      profileOwnerUsername: username,
    });
  };

  const { mutate: unfollowUser } = useMutation({
    mutationFn: async (usernameToUnfollow: string) => {
      setMutatingUsername(usernameToUnfollow);
      await axios.delete(`/api/follow/${usernameToUnfollow}/follow`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followModalList"] });
    },
    onError: (error) => {
      let errorMessage = "Ocorreu um erro ao deixar de seguir o usuário.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    },
    onSettled: () => {
      setMutatingUsername(null);
    },
  });

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<UserPreview[], Error>({
    queryKey: ["followModalList", username, listType],
    queryFn: () => fetchModalUsers(username, listType),
    enabled: !!username,
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md border-gray-700 bg-slate-800 relative animate-in fade-in-0 zoom-in-95">
        <CardHeader className="text-center">
          <CardTitle className="capitalize text-white">
            {listType === "followers" ? "Seguidores" : "Seguindo"}
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer transition-opacity"
          >
            <X size={24} />
          </button>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8 text-white">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-red-500">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <p>{error.message}</p>
            </div>
          ) : users && users.length > 0 ? (
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.username}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-700 transition-colors text-white"
                >
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <Avatar className="bg-slate-600">
                      <AvatarImage
                        src={user.avatar_url || undefined}
                        alt={`avatar de ${user.username}`}
                      />
                      <AvatarFallback className="bg-slate-600">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold truncate">
                      <span className={getRoleColor(user.role)}>
                        {user.username}
                      </span>
                    </span>
                  </Link>
                  <div className="flex-shrink-0">
                    {isOwnProfile && listType === "followers" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveClick(user.username)}
                        disabled={isRemoving}
                        className="w-[80px] cursor-pointer"
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
                        onClick={() => unfollowUser(user.username)}
                        disabled={mutatingUsername === user.username}
                        className="w-[120px] cursor-poiner"
                      >
                        {mutatingUsername === user.username ? (
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
              Nenhum usuário para mostrar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
