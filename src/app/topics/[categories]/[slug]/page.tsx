"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/services/auth";
import {
  getTopicBySlug,
  createComment,
  NewCommentData,
} from "@/services/topic";
import { PublishForm } from "@/components/PublishTopicForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatLastLogin } from "@/utils/dateUtils";

interface Comment {
  id: number;
  content: string;
  created: string;
  profiles: {
    username: string;
    avatar_url: string | null;
    role: string;
  };
}

interface TopicDetails {
  id: number;
  title: string;
  content: string;
  created: string;
  profiles: {
    username: string;
    avatar_url: string | null;
    role: string;
  };
  comentarios: Comment[];
}

export default function TopicPage() {
  const params = useParams();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [topic, setTopic] = React.useState<TopicDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);

  React.useEffect(() => {
    if (!slug) return;

    const fetchTopic = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTopicBySlug(slug);
        setTopic(data);
      } catch (err) {
        setError(
          "Não foi possível carregar o tópico. Tente novamente mais tarde."
        );
        console.error(err);
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
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
      alert((err as Error).message);
    } finally {
      setIsSubmittingComment(false);
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
    <div className="min-h-screen text-gray-300 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Card do Tópico Principal */}
        <Card className="bg-gray-800/50 border border-gray-700">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">
              {topic.title}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <Avatar>
                <AvatarImage src={topic.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {topic.profiles.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">
                  {topic.profiles.username}
                </p>
                <p className="text-xs text-gray-400">
                  {/* ALTERADO: Usando sua função formatLastLogin */}
                  Postado {formatLastLogin(topic.created).toLowerCase()}
                </p>
              </div>
            </div>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>{topic.content}</p>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-gray-700" />

        {/* Lista de Comentários */}
        <div className="space-y-4">
          {topic.comentarios.map((comment) => (
            <Card
              key={comment.id}
              className="bg-gray-800/30 border border-gray-700/50"
            >
              <CardContent className="p-5 flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.profiles.avatar_url || undefined} />
                  <AvatarFallback>
                    {comment.profiles.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-white">
                      {comment.profiles.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {/* ALTERADO: Usando sua função formatLastLogin */}
                      {formatLastLogin(comment.created)}
                    </p>
                  </div>
                  <p className="mt-2 text-gray-300">{comment.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Formulário para Adicionar Comentário */}
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
            <p className="text-gray-400">
              Você precisa estar logado para comentar.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
