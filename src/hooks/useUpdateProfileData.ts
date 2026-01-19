import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services";
import { toast } from "sonner";

export const useUpdateProfileData = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfileData,
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
