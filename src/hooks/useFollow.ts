"use client"
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useFollow = (
  profileId: string,
  initialIsFollowing: boolean,
  initialFollowersCount: number
) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFollow = async () => {
    setIsLoading(true);
    setError(null);
    setIsFollowing(true);
    setFollowersCount((prev) => prev + 1);

    try {
      const res = await fetch(`${API_URL}/profiles/${profileId}/follow`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Falha ao seguir o usuário.' }));
        throw new Error(errorData.message);
      }
    } catch (error: unknown) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro ao tentar seguir o usuário.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    setError(null);
    setIsFollowing(false);
    setFollowersCount((prev) => prev - 1);

    try {
      const response = await fetch(`${API_URL}/profiles/${profileId}/follow`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao deixar de seguir o usuário.' }));
        throw new Error(errorData.message);
      } 

    } catch (error: unknown) {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro ao deixar de seguir o usuário.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, followersCount, isLoading, error, handleFollow, handleUnfollow };
};