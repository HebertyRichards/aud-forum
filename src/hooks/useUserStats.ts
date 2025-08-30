"use client";

import { useState, useEffect } from 'react';
import { getUserStats } from '@/services/profile';
import { UserStats } from '@/types/profile'; 

export function useUserStats(username?: string) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserStats(username);
        setStats(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  return { stats, isLoading, error };
}