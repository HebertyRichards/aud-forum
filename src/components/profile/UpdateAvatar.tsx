"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/services/auth";
import imageCompression from "browser-image-compression";
import { Loader2, Camera, Trash2 } from "lucide-react";
import { UpdateAvatarProps } from "@/types/profile";
import { toast } from "sonner";

export function UpdateAvatar({
  onSuccess,
  currentAvatarUrl,
}: UpdateAvatarProps & { currentAvatarUrl?: string | null }) {
  const { user, updateUserAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      const res = await fetch(`${API_URL}/profile/user/avatar`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Falha ao atualizar o avatar.");
      }
      toast.success("Avatar atualizado com sucesso!", { id: toastId });
      updateUserAvatar(result.avatar_url);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado";
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
      const res = await fetch(`${API_URL}/profile/user/avatar`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Falha ao remover o avatar.");
      }

      toast.success("Avatar removido com sucesso!", { id: toastId });
      updateUserAvatar(result.avatar_url);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado";
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
      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-4">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-white" />
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
