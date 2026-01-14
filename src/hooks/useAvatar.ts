import { useMutation } from "@tanstack/react-query";
import { uploadAvatarApi, deleteAvatarApi } from "@/app/api/endpoints/profiles";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth";

export const useAvatarActions = () => {
  const { updateUserAvatar } = useAuth();

  const uploadMutation = useMutation({
    mutationFn: uploadAvatarApi,
    onMutate: () =>
      toast.loading("Atualizando avatar...", { id: "avatar-toast" }),
    onSuccess: (data) => {
      toast.success("Avatar atualizado com sucesso!", { id: "avatar-toast" });
      updateUserAvatar(data.avatar_url);
      setTimeout(() => window.location.reload(), 500);
    },
    onError: (error: Error) => {
      toast.error(error.message, { id: "avatar-toast" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAvatarApi,
    onMutate: () =>
      toast.loading("Removendo avatar...", { id: "avatar-toast" }),
    onSuccess: (data) => {
      toast.success("Avatar removido com sucesso!", { id: "avatar-toast" });
      updateUserAvatar(data.avatar_url);
      setTimeout(() => window.location.reload(), 500);
    },
    onError: (error: Error) => {
      toast.error(error.message, { id: "avatar-toast" });
    },
  });

  return {
    uploadAvatar: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    deleteAvatar: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    error: uploadMutation.error || deleteMutation.error,
  };
};
