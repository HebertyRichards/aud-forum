import { useQuery } from "@tanstack/react-query";
import { getFollowList } from "@/app/api/endpoints/followers";
import { UserPreview } from "@/schema/user";

export const useFollowList = (
  username: string,
  type: "followers" | "following"
) => {
  return useQuery<UserPreview[], Error>({
    queryKey: ["followList", username, type],
    queryFn: () => getFollowList(username, type),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
};
