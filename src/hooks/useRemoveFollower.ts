"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeFollowerFn } from "@/app/api/endpoints/followers";

export const useRemoveFollower = () => {
  const queryClient = useQueryClient();

  const { mutate: removeFollower, isPending } = useMutation({
    mutationFn: removeFollowerFn,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Seguidor removido com sucesso!");
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
