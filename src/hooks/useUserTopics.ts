"use client";

import { useState, useEffect } from 'react';
import { getTopicsByAuthor } from '@/services/profile';
import { TopicSummary } from '@/types/post';

export function useUserTopics(username?: string) {
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setIsLoading(false);
      return;
    }

    const fetchTopics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTopicsByAuthor(username);
        setTopics(data);
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

    fetchTopics();
  }, [username]);

  return { topics, isLoading, error };
}