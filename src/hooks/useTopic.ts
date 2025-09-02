"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/services/auth";
import {
  getTopicBySlug,
  createComment,
  deleteTopic,
  updateTopic,
  deleteComment,
  updateComment,
} from "@/services/topic";
import { NewCommentData, TopicDetails, UpdateTopicData } from "@/types/post";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export function useTopicPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { canCreateComment, isCheckingComment, checkCommentPermission } = usePermissions(); 

  const slug = params.slug as string;
  const category = params.categories as string;

  const [topic, setTopic] = useState<TopicDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentImages, setCommentImages] = useState<File[]>([]); 

  useEffect(() => {
    if (!slug) return;
    const fetchTopic = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTopicBySlug(slug);
        setTopic(data);
        if (user) { 
          checkCommentPermission(data.id);
        }
      } catch {
        setError(
          "Não foi possível carregar o tópico. Tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopic();
  }, [slug, user, checkCommentPermission]);

  const handlers = useMemo(
    () => ({
      handleCommentSubmit: async () => {
        if (!canCreateComment) {
          toast.error("Você não tem permissão para comentar.");
          return;
        }
        if (!topic || !newCommentContent.trim()) return;
        setIsSubmitting(true);
        try {
          const commentData: NewCommentData = {
            content: newCommentContent,
            topicId: topic.id,
          };
          const newComment = await createComment(commentData, commentImages);
          setTopic((prev) =>
            prev
              ? { ...prev, comentarios: [...prev.comentarios, newComment] }
              : null
          );
          setNewCommentContent("");
          setCommentImages([]);
          toast.success("Comentário publicado com sucesso!");
        } catch (error: unknown) {
          toast.error((error as Error).message);
        } finally {
          setIsSubmitting(false);
        }
      },

      handleDeleteComment: async (commentId: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este comentário?"))
          return;
        try {
          await deleteComment(commentId);
          setTopic((prev) =>
            prev
              ? {
                  ...prev,
                  comentarios: prev.comentarios.filter(
                    (c) => c.id !== commentId
                  ),
                }
              : null
          );
          toast.success("Comentário deletado com sucesso!");
        } catch (error: unknown) {
          toast.error(
            (error as Error).message || "Falha ao deletar o comentário."
          );
        }
      },

      handleUpdateComment: async (commentId: number, content: string) => {
        try {
          const updatedComment = await updateComment(commentId, content);
          setTopic((prev) => {
            if (!prev) return null;
            const updatedComentarios = prev.comentarios.map((c) =>
              c.id === commentId ? updatedComment : c
            );
            return { ...prev, comentarios: updatedComentarios };
          });
          toast.success("Comentário atualizado com sucesso!");
        } catch (error: unknown) {
          toast.error((error as Error).message);
        }
      },

      handleDeleteTopic: async () => {
        if (
          !topic ||
          !window.confirm("Tem certeza que deseja deletar este tópico?")
        )
          return;
        setIsSubmitting(true);
        try {
          await deleteTopic(topic.id);
          toast.success("Tópico deletado com sucesso!");
          router.push(`/topics/${category}`);
        } catch {
          toast.error("Falha ao deletar o tópico. Por favor, tente novamente.");
        } finally {
          setIsSubmitting(false);
        }
      },

      handleUpdateTopic: async (editData: UpdateTopicData) => {
        if (!topic) return;
        setIsSubmitting(true);
        try {
          const updatedTopicData = await updateTopic(topic.id, editData);
          setTopic((prev) => (prev ? { ...prev, ...updatedTopicData } : null));
          toast.success("Tópico atualizado com sucesso!");
        } catch {
          toast.error("Falha ao atualizar o tópico. Tente novamente.");
        } finally {
          setIsSubmitting(false);
        }
      },
    }),
    [topic, newCommentContent, router, category, canCreateComment]
  );

  const addCommentImage = (file: File) => {
    setCommentImages((prev) => [...prev, file]);
  }

  return {
    topic,
    isLoading,
    error,
    user,
    category,
    newCommentContent,
    setNewCommentContent,
    isSubmitting,
    canCreateComment,
    isCheckingComment,
    handlers,
    addCommentImage,
  };
}