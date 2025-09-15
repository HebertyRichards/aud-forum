"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type RemoveFollowerVars = {
  followerUsername: string;
  profileOwnerUsername: string;
};

const removeFollowerFn = async ({ followerUsername }: RemoveFollowerVars) => {
  const { data } = await axios.delete(
    `/api/follow/followers/${followerUsername}`,
    { withCredentials: true }
  );
  return data;
};

export const useRemoveFollower = () => {
  const queryClient = useQueryClient();

  const { mutate: removeFollower, isPending } = useMutation({
    mutationFn: removeFollowerFn,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Seguidor removido com sucesso!");
      const { profileOwnerUsername } = variables;
      queryClient.invalidateQueries({ queryKey: ["followModalList", profileOwnerUsername] });
      queryClient.invalidateQueries({ queryKey: ["followStats", profileOwnerUsername] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Não foi possível remover o seguidor.");
      }
    },
  });

  return { removeFollower, isPending };
};