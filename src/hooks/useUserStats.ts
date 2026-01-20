import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services";

export const useUserStats = (username: string) => {
  return useQuery({
    queryKey: ["userStats", username],
    queryFn: () => profileService.getUserStats(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
};
