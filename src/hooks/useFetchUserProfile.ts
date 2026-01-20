"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { followService } from "@/services";

export const useFetchUserProfile = (profileUsername: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile", profileUsername],
    queryFn: () => followService.getUserProfile(profileUsername),
    enabled: !!profileUsername,
    staleTime: 5 * 60 * 1000,
  });

  const handleSuccessUpdate = () => {
    queryClient.invalidateQueries({
      queryKey: ["userProfile", profileUsername],
    });
  };

  return { data, isLoading, error, handleSuccessUpdate };
};
