"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/services/auth";
import {
  getTopicBySlug,
  createComment,
  deleteTopic,
  updateTopic,
  deleteComment,
} from "@/services/topic";
import { NewCommentData } from "@/types/post";
import { PublishForm } from "@/components/PublishTopicForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatLastLogin } from "@/utils/dateUtils";
import { Comment, TopicDetails, UpdateTopicData } from "@/types/post";
import { getRoleColor } from "@/utils/colors";
import { Toaster, toast } from "sonner";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [topic, setTopic] = useState<TopicDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState<UpdateTopicData>({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (!slug) return;

    const fetchTopic = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTopicBySlug(slug);
        setTopic(data);
      } catch {
        setError(
          "Não foi possível carregar o tópico. Tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [slug]);

  const handleCommentSubmit = async (data: { content: string }) => {
    if (!topic) return;

    setIsSubmittingComment(true);
    try {
      const commentData: NewCommentData = {
        content: data.content,
        topicId: topic.id,
      };

      const newComment = await createComment(commentData);

      setTopic((prevTopic) => {
        if (!prevTopic) return null;
        const commentForState: Comment = {
          ...newComment,
          created: new Date().toISOString(),
          profiles: {
            username: user?.username || "Você",
            avatar_url: user?.avatar_url || null,
            role: user?.role || "user",
          },
        };
        return {
          ...prevTopic,
          comentarios: [...prevTopic.comentarios, commentForState],
        };
      });
      toast.success("Comentário publicado com sucesso!");
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteTopic = async () => {
    if (!topic) return;
    const confirmed = window.confirm(
      "Tem certeza que deseja deletar este tópico? Esta ação não pode ser desfeita."
    );
    if (confirmed) {
      setIsDeleting(true);
      setError(null);
      try {
        await deleteTopic(topic.id);
        toast.success("Tópico deletado com sucesso!");
        router.push("/");
      } catch {
        toast.error("Falha ao deletar o tópico. Por favor, tente novamente.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja deletar este comentário?"
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteComment(commentId);
      setTopic((prevTopic) => {
        if (!prevTopic) return null;
        return {
          ...prevTopic,
          comentarios: prevTopic.comentarios.filter(
            (comment) => comment.id !== commentId
          ),
        };
      });

      toast.success("Comentário deletado com sucesso!");
    } catch {
      toast.error(
        "Falha ao deletar o comentário. Você pode não ter permissão."
      );
    }
  };

  const handleStartEdit = () => {
    if (!topic) return;
    setEditData({ title: topic.title, content: topic.content });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setIsUpdating(true);
    setError(null);
    try {
      const updatedTopicData = await updateTopic(topic.id, editData);
      setTopic((prevTopic) => {
        if (!prevTopic) return null;
        return { ...prevTopic, ...updatedTopicData };
      });
      setIsEditing(false);
      toast.success("Tópico atualizado com sucesso!");
    } catch {
      toast.error("Falha ao atualizar o tópico. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 text-white">Carregando tópico...</div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!topic) {
    return (
      <div className="text-center p-10 text-white">Tópico não encontrado.</div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="min-h-screen text-gray-300 font-sans p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="bg-white border-gray-100/50 dark:bg-gray-800 border-gray400/50">
            {isEditing ? (
              <form onSubmit={handleUpdateSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-1"
                    >
                      Título
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium mb-1"
                    >
                      Conteúdo
                    </label>
                    <textarea
                      id="content"
                      rows={8}
                      value={editData.content}
                      onChange={(e) =>
                        setEditData({ ...editData, content: e.target.value })
                      }
                      className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-4">
                  <button type="button" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded-lg disabled:bg-green-500/50 disabled:cursor-not-allowed dark:bg-green-500"
                  >
                    {isUpdating ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            ) : (
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold">{topic.title}</h1>
                  {user && topic && user.id === topic.author_id && (
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={handleStartEdit}
                        className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-3 rounded-lg text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={handleDeleteTopic}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 font-bold py-2 px-3 rounded-lg text-sm disabled:bg-gray-500"
                      >
                        {isDeleting ? "..." : "Deletar"}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <Avatar>
                    <AvatarImage src={topic.profiles.avatar_url || undefined} />
                    <AvatarFallback>
                      {topic.profiles.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      className={`font-semibold ${getRoleColor(
                        topic.profiles.role
                      )}`}
                    >
                      {topic.profiles.username}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-500">
                      Postado {formatLastLogin(topic.created).toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p>{topic.content}</p>
                </div>
              </CardContent>
            )}
          </Card>
          <Separator className="bg-gray-700" />
          <div className="space-y-4">
            {topic.comentarios.map((comment) => (
              <Card
                key={comment.id}
                className="bg-white border-gray-100/50 dark:bg-gray-800 border-gray400/50"
              >
                <CardContent className="p-5 flex gap-4">
                  <Avatar>
                    <AvatarImage
                      src={comment.profiles.avatar_url || undefined}
                    />
                    <AvatarFallback>
                      {comment.profiles.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                    <p className={`font-semibold ${getRoleColor(
                        comment.profiles.role
                      )}`}>
                        {comment.profiles.username}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-gray-700 dark:text-gray-500">
                          {formatLastLogin(comment.created)}
                        </p>
                        {user && user.id === comment.author_id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-md border border-red-500 bg-red-500 hover:bg-red-400 text-xs font-bold"
                            title="Deletar comentário"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {user ? (
            <div>
              <PublishForm
                type="comment"
                onSubmit={handleCommentSubmit}
                isSubmitting={isSubmittingComment}
              />
            </div>
          ) : (
            <Card className="text-center p-6 bg-gray-800/50 border border-gray-700">
              <p>Você precisa estar logado para comentar.</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
