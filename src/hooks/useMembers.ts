import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllMembers } from "@/services/member";

export function useMembers(page: number) {
  return useQuery({
    queryKey: ["members", page],
    queryFn: () => getAllMembers(page),
    placeholderData: keepPreviousData,
  });
}