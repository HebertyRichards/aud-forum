"use client";

import { useEffect } from "react";
import { fetchOwnProfile } from "@/app/api/endpoints/followers";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";

export const useFetchOwnProfile = () => {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["ownProfile", user?.username],
    queryFn: () => fetchOwnProfile(user?.username as string),
    enabled: !!user?.username,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (auth.loading) return;
    if (!user) {
      router.push("/");
    }
  }, [user, auth.loading, router]);

  const handleSuccessUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["ownProfile", user?.username] });
  };

  return {
    profile: data,
    isLoading,
    isFetching,
    error,
    handleSuccessUpdate,
  };
};
