import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { memberService } from "@/services";

export function useMembers(page: number) {
  return useQuery({
    queryKey: ["members", page],
    queryFn: () => memberService.getAllMembers(page),
    placeholderData: keepPreviousData,
  });
}