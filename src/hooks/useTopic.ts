"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/services/auth";
import {
  getTopicBySlugWithComments, 
  createComment,
  deleteTopic,
  updateTopic,
  deleteComment,
  updateComment,
} from "@/services/topic";
import { NewCommentData, TopicDetails, UpdateTopicData } from "@/types/post";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

const COMMENTS_PER_PAGE = 10;

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
  const [totalComments, setTotalComments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentImages, setCommentImages] = useState<File[]>([]); 

  const fetchTopic = useCallback(async (page: number) => {
    setIsLoading(true); 
    setError(null);
    try {
      const { data, totalComments: newTotalComments } = await getTopicBySlugWithComments(slug, page, COMMENTS_PER_PAGE);
      setTopic(data);
      setTotalComments(newTotalComments);
      setCurrentPage(page);
      if (user && page === 1) {
        checkCommentPermission(data.id);
      }
    } catch {
      setError(
        "Não foi possível carregar o tópico. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug, user, checkCommentPermission]);

  useEffect(() => {
    if (slug) {
      fetchTopic(1); 
    }
  }, [slug, fetchTopic]); 

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage > 0) {
      fetchTopic(newPage);
    }
  };
  
  const addCommentImage = (file: File) => {
    setCommentImages((prev) => [...prev, file]);
  };

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
          const commentData: NewCommentData = { content: newCommentContent, topicId: topic.id };
          await createComment(commentData, commentImages);
          setNewCommentContent("");
          setCommentImages([]);
          toast.success("Comentário publicado com sucesso!");
          const newTotal = totalComments + 1;
          const lastPage = Math.ceil(newTotal / COMMENTS_PER_PAGE);
          fetchTopic(lastPage);
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
          toast.success("Comentário deletado com sucesso!");
          fetchTopic(currentPage); 
        } catch (error: unknown) {
          toast.error(
            (error as Error).message || "Falha ao deletar o comentário."
          );
        }
      },

      handleUpdateComment: async (commentId: number, content: string) => {
        try {
          await updateComment(commentId, content);
          toast.success("Comentário atualizado com sucesso!");
          fetchTopic(currentPage);
        } catch (error: unknown) {
          toast.error((error as Error).message);
        }
      },
      handleDeleteTopic: async () => {
        if (!topic ||
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
    [topic, newCommentContent, canCreateComment, commentImages, currentPage, totalComments, fetchTopic, router, category]
  );
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
    totalComments,
    currentPage,
    handlePageChange,
  };
}