import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileDataApi } from "@/app/api/endpoints/profiles";
import { toast } from "sonner";

export const useUpdateProfileData = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileDataApi,
    onMutate: () => {
      toast.loading("Atualizando perfil...", { id: "update-profile-data" });
    },
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!", {
        id: "update-profile-data",
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: Error) => {
      toast.error(error.message, { id: "update-profile-data" });
    },
  });
};
