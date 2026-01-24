import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services";
import { toast } from "sonner";
import { handleError } from "@/utils/errorsApi";

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
      toast.error("Senha incorreta ou falha no servidor. Tente novamente.");
      handleError(error, "Falha ao deletar a conta.");
    },
  });
};
