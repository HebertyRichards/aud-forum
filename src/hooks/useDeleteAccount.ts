import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "@/app/api/endpoints/profiles";
import { toast } from "sonner";
import { handleApiError } from "@/utils/apiErrors";

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
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
