"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/services/auth";
import imageCompression from "browser-image-compression";
import { Loader2, Camera, Trash2 } from "lucide-react";
import { UpdateAvatarProps } from "@/types/profile";
import { toast } from "sonner";
import axios from "axios";

export function UpdateAvatar({
  onSuccess,
  currentAvatarUrl,
}: UpdateAvatarProps & { currentAvatarUrl?: string | null }) {
  const { user, updateUserAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Atualizando avatar...");
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      if (!user) throw new Error("Usuário não encontrado.");
      const formData = new FormData();
      formData.append("avatar", compressedFile);
      const res = await axios.patch(`/api/profile/user/avatar`, formData, {
        withCredentials: true,
      });
      toast.success("Avatar atualizado com sucesso!", { id: toastId });
      updateUserAvatar(res.data.avatar_url);
      onSuccess();
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro inesperado";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.error || "Falha ao atualizar o avatar.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Removendo avatar...");
    try {
      const res = await axios.delete(`/api/profile/user/avatar`, {
        withCredentials: true,
      });

      toast.success("Avatar removido com sucesso!", { id: toastId });
      updateUserAvatar(res.data.avatar_url);
      onSuccess();
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro inesperado";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.error || "Falha ao remover o avatar.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={loading}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-4 text-white">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        ) : (
          <>
            <button
              onClick={handleClick}
              disabled={loading}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              title="Alterar avatar"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>

            {currentAvatarUrl && (
              <button
                onClick={handleRemoveAvatar}
                disabled={loading}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="Remover avatar"
              >
                <Trash2 className="h-6 w-6 text-white" />
              </button>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2 text-center absolute -bottom-6 w-full">
          {error}
        </p>
      )}
    </div>
  );
}
