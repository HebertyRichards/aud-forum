import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContactsApi } from "@/app/api/endpoints/profiles";
import { toast } from "sonner";

export const useUpdateContacts = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContactsApi,
    onMutate: () => {
      toast.loading("Salvando alterações...", { id: "update-contacts" });
    },
    onSuccess: () => {
      toast.success("Contatos atualizados com sucesso!", {
        id: "update-contacts",
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: Error) => {
      toast.error(error.message, { id: "update-contacts" });
    },
  });
};
