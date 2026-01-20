import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followService } from "@/services";
import { toast } from "sonner";
import { UserPreview } from "@/schema/user";

export const useFollowModalData = (
  username: string,
  listType: "followers" | "following"
) => {
  return useQuery<UserPreview[], Error>({
    queryKey: ["followModalList", username, listType],
    queryFn: () => followService.getFollowList(username, listType),
    enabled: !!username,
  });
};

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followService.unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followModalList"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
