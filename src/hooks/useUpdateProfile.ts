import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services";
import { toast } from "sonner";
import { handleError } from "@/utils/errorsApi";

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
      handleError(error, "Falha ao atualizar o perfil.");
      toast.error("Falha ao atualizar o perfil.");
    },
  });
};
