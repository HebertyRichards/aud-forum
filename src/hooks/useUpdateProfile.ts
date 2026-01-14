import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/app/api/endpoints/profiles";
import { toast } from "sonner";
import { handleApiError } from "@/utils/apiErrors";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
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
