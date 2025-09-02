"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTopic } from "@/services/topic";
import { NewTopicData } from "@/types/post";
import { toast } from "sonner";

export function useCreateTopic(category: string) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTopicSubmit = async (hasPermission: boolean | null) => {
    if (!hasPermission) {
      toast.error("Você não tem permissão para criar um tópico aqui.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("O título e o conteúdo não podem estar vazios.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const topicData: NewTopicData = {
        title,
        content,
        category,
      };

      const newTopic = await createTopic(topicData, images);

      toast.success("Tópico criado com sucesso!");
      router.push(`/topics/${category}/${newTopic.slug}`);
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || "Ocorreu um erro desconhecido.";
      setError(errorMessage);
      toast.error(`Falha ao criar o tópico: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = (file: File) => {
    setImages((prev) => [...prev, file]);
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isSubmitting,
    error,
    handleTopicSubmit,
    addImage,
  };
}