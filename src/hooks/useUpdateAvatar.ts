"use client";
import { UserWithProfile } from "@/types/autentication";
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

export const updateUserAvatar = (newAvatarUrl: string) => {
  queryClient.setQueryData(
    ["auth-user"],
    (oldUser: UserWithProfile | undefined) => {
      if (!oldUser) return null;
      return {
        ...oldUser,
        avatar_url: newAvatarUrl,
        user_metadata: { ...oldUser.user_metadata, avatar_url: newAvatarUrl },
      };
    }
  );
};
