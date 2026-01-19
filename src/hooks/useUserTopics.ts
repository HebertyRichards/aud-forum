import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services";

export const useUserTopics = (username: string) => {
  return useQuery({
    queryKey: ["userTopics", username],
    queryFn: () => profileService.getTopicsByAuthor(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 2,
  });
};
