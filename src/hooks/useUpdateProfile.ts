import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services";
import { toast } from "sonner";
import { handleApiError } from "@/utils/apiErrors";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error) => {
      handleApiError(error, "Falha ao atualizar o perfil.");
      toast.error("Falha ao atualizar o perfil.");
    },
  });
};
