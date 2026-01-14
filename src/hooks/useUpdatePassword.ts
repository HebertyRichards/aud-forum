import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/app/api/endpoints/profiles";
import { toast } from "sonner";
import { handleApiError } from "@/utils/apiErrors";

export const useUpdatePassword = (onClose: () => void) => {
  return useMutation({
    mutationFn: updatePassword,
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
