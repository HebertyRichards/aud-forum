"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/services/auth";
import imageCompression from "browser-image-compression";
import { Loader2, Camera } from "lucide-react";
import { UpdateAvatarProps } from "@/types/profile";

export function UpdateAvatar({ onSuccess }: UpdateAvatarProps) {
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
      updateUserAvatar(result.avatar_url);
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
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
      <button
        onClick={handleClick}
        disabled={loading}
        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        ) : (
          <Camera className="h-6 w-6 text-white" />
        )}
      </button>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
