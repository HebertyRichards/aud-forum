import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services";
import { toast } from "sonner";
import { handleApiError } from "@/utils/apiErrors";

export const useUpdatePassword = (onClose: () => void) => {
  return useMutation({
    mutationFn: profileService.updatePassword,
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      setTimeout(() => {
        onClose();
      }, 1500);
    },
    onError: (error) => {
      handleApiError(error, "Falha ao alterar a senha.");
      toast.error("Falha ao alterar a senha.");
    },
  });
};
