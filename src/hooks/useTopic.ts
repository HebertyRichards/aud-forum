"use-client";

import { useState, useMemo, useEffect } from "react"; // 1. Importar useEffect
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/services/auth";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { canCreateComment, isCheckingComment, checkCommentPermission } = usePermissions(); 

  const slug = params.slug as string;
  const category = params.categories as string;

  const [currentPage, setCurrentPage] = useState(1);

  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentImages, setCommentImages] = useState<File[]>([]); 

  const { data, isLoading, error } = useQuery<
    { data: TopicDetails; totalComments: number },
    Error
  >({
    queryKey: ["topic", slug, currentPage],
    queryFn: () => getTopicBySlugWithComments(slug, currentPage, COMMENTS_PER_PAGE),
    enabled: !!slug,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.data && user) {
      checkCommentPermission(data.data.id);
    }
  }, [data, user, checkCommentPermission]);


  const topic = data?.data ?? null;
  const totalComments = data?.totalComments ?? 0;

  const createCommentMutation = useMutation({
    mutationFn: (variables: { commentData: NewCommentData; images: File[] }) =>
      createComment(variables.commentData, variables.images),
    onSuccess: () => {
      toast.success("Comentário publicado com sucesso!");
      setNewCommentContent("");
      setCommentImages([]);
      const newTotal = totalComments + 1;
      const lastPage = Math.ceil(newTotal / COMMENTS_PER_PAGE);
      setCurrentPage(lastPage);
      queryClient.invalidateQueries({ queryKey: ["topic", slug] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      toast.success("Comentário deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["topic", slug, currentPage] });
    },
    onError: (err: Error) => toast.error(err.message || "Falha ao deletar o comentário."),
  });
  
  const updateCommentMutation = useMutation({
    mutationFn: (variables: { commentId: number; content: string }) =>
      updateComment(variables.commentId, variables.content),
    onSuccess: () => {
      toast.success("Comentário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["topic", slug, currentPage] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteTopicMutation = useMutation({
    mutationFn: (topicId: number) => deleteTopic(topicId),
    onSuccess: () => {
      toast.success("Tópico deletado com sucesso!");
      router.push(`/topics/${category}`);
    },
    onError: () => toast.error("Falha ao deletar o tópico. Por favor, tente novamente."),
  });

  const updateTopicMutation = useMutation({
    mutationFn: (variables: { topicId: number; editData: UpdateTopicData }) =>
      updateTopic(variables.topicId, variables.editData),
    onSuccess: () => {
      toast.success("Tópico atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["topic", slug, currentPage] });
    },
    onError: () => toast.error("Falha ao atualizar o tópico. Tente novamente."),
  });

  const isSubmitting =
    createCommentMutation.isPending ||
    deleteTopicMutation.isPending ||
    updateTopicMutation.isPending;

  const handlers = useMemo(
    () => ({
      handleCommentSubmit: () => {
        if (!canCreateComment) return toast.error("Você não tem permissão para comentar.");
        if (!topic || !newCommentContent.trim()) return;
        const commentData: NewCommentData = { content: newCommentContent, topicId: topic.id };
        createCommentMutation.mutate({ commentData, images: commentImages });
      },
      handleDeleteComment: (commentId: number) => {
        if (window.confirm("Tem certeza que deseja deletar este comentário?")) {
          deleteCommentMutation.mutate(commentId);
        }
      },
      handleUpdateComment: (commentId: number, content: string) => {
        updateCommentMutation.mutate({ commentId, content });
      },
      handleDeleteTopic: () => {
        if (topic && window.confirm("Tem certeza que deseja deletar este tópico?")) {
          deleteTopicMutation.mutate(topic.id);
        }
      },
      handleUpdateTopic: (editData: UpdateTopicData) => {
        if (!topic) return;
        updateTopicMutation.mutate({ topicId: topic.id, editData });
      },
    }),
    [
      topic, newCommentContent, commentImages, canCreateComment,
      createCommentMutation, deleteCommentMutation, updateCommentMutation,
      deleteTopicMutation, updateTopicMutation,
    ]
  );
  
  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage > 0) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const addCommentImage = (file: File) => {
    setCommentImages((prev) => [...prev, file]);
  };

  return {
    topic,
    isLoading,
    error: error?.message || null,
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