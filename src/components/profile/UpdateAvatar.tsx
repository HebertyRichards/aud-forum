"use client";

import { useRef } from "react";
import imageCompression from "browser-image-compression";
import { Loader2, Camera, Trash2 } from "lucide-react";
import { useAvatarActions } from "@/hooks/useAvatar";
import { toast } from "sonner";

interface UpdateAvatarProps {
  currentAvatarUrl?: string | null;
}

export function UpdateAvatar({ currentAvatarUrl }: UpdateAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, deleteAvatar, isUploading, isDeleting, error } =
    useAvatarActions();

  const isLoading = isUploading || isDeleting;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      uploadAvatar(compressedFile);
    } catch (error) {
      toast.error("Erro ao processar a imagem. Tente novamente.");
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={isLoading}
      />
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-4 text-white z-10">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        ) : (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              title="Alterar avatar"
            >
              <Camera className="h-6 w-6" />
            </button>
            {currentAvatarUrl && (
              <button
                onClick={() => deleteAvatar()}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors text-red-400"
                title="Remover avatar"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
