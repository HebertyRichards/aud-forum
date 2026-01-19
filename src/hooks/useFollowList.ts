import { useQuery } from "@tanstack/react-query";
import { followService } from "@/services";
import { UserPreview } from "@/schema/user";

export const useFollowList = (
  username: string,
  type: "followers" | "following"
) => {
  return useQuery<UserPreview[], Error>({
    queryKey: ["followList", username, type],
    queryFn: () => followService.getFollowList(username, type),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
};
