"use client";

import { useQuery } from '@tanstack/react-query';
import { getTopicsByAuthor } from '@/services/profile';
import { TopicSummary } from '@/types/post';

export function useUserTopics(username?: string) {
  const {
    data: topics, 
    isLoading,
    error,
    isError,
  } = useQuery<TopicSummary[], Error>({
    queryKey: ['userTopics', username],
    queryFn: () => getTopicsByAuthor(username!),
    enabled: !!username,
  });

  return {
    topics: topics ?? [],
    isLoading,
    error: isError ? error.message : null,
  };
}