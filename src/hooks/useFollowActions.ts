import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getModalUsers, unfollowUserApi } from "@/app/api/endpoints/followers";
import { toast } from "sonner";
import { UserPreview } from "@/schema/user";

export const useFollowModalData = (
  username: string,
  listType: "followers" | "following"
) => {
  return useQuery<UserPreview[], Error>({
    queryKey: ["followModalList", username, listType],
    queryFn: () => getModalUsers(username, listType),
    enabled: !!username,
  });
};

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollowUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followModalList"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
