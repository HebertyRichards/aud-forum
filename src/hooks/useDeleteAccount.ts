import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services";
import { toast } from "sonner";
import { handleApiError } from "@/utils/apiErrors";

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: profileService.deleteAccount,
    onSuccess: () => {
      toast.success("Conta deletada com sucesso. Você será redirecionado.");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error) => {
      handleApiError(error, "Falha ao deletar a conta.");
      toast.error("Senha incorreta ou falha no servidor. Tente novamente.");
    },
  });
};
