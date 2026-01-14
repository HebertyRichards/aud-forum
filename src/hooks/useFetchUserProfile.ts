"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile } from "@/app/api/endpoints/followers";

export const useFetchUserProfile = (profileUsername: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile", profileUsername],
    queryFn: () => fetchUserProfile(profileUsername),
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
