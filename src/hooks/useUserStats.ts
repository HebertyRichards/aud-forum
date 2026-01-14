import { useQuery } from "@tanstack/react-query";
import { getUserStatsApi } from "@/app/api/endpoints/profiles";

export const useUserStats = (username: string) => {
  return useQuery({
    queryKey: ["userStats", username],
    queryFn: () => getUserStatsApi(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
};
