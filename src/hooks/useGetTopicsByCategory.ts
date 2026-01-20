"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { topicService, TopicsResponse } from "@/services";

const TOPICS_PER_PAGE = 10;

export const useGetTopicsByCategory = (
  category: string,
  currentPage: number,
  isEnabled: boolean = true
) => {
  const { isLoading, data, isFetching } = useQuery<TopicsResponse, Error>({
    queryKey: ["topics", category, currentPage],
    queryFn: () =>
      topicService.getTopicsByCategory(category, currentPage, TOPICS_PER_PAGE),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return { isLoading, data, isFetching, TOPICS_PER_PAGE };
};