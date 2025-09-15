"use client";

import { useQuery } from '@tanstack/react-query';
import { getUserStats } from '@/services/profile';
import type { UserStats } from '@/types/profile'; 

export function useUserStats(username?: string) {
  const { 
    data: stats,
    isLoading, 
    error,
    isError,
  } = useQuery<UserStats, Error>({
    queryKey: ['userStats', username], 
    queryFn: () => getUserStats(username!),
    enabled: !!username,
  });

  return { 
    stats, 
    isLoading, 
    error: isError ? error.message : null 
  };
}