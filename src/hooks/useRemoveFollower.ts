"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followService } from "@/services";

export const useRemoveFollower = () => {
  const queryClient = useQueryClient();

  const { mutate: removeFollower, isPending } = useMutation({
    mutationFn: (variables: { followerUsername: string; profileOwnerUsername: string }) =>
      followService.removeFollower(variables.followerUsername),
    onSuccess: (_data, variables) => {
      toast.success("Seguidor removido com sucesso!");
      const { profileOwnerUsername } = variables;
      queryClient.invalidateQueries({
        queryKey: ["followModalList", profileOwnerUsername],
      });
      queryClient.invalidateQueries({
        queryKey: ["followStats", profileOwnerUsername],
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Não foi possível remover o seguidor.");
      }
    },
  });

  return { removeFollower, isPending };
};
