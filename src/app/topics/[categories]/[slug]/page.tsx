"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTopicPage } from "@/hooks/useTopic";
import {
  Comment,
  TopicDetails,
  CommentHandlers,
  TopicHandlers,
} from "@/types/post";
import { PublishForm } from "@/components/PublishTopicForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserWithProfile } from "@/types/autentication";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatPostTimestamp } from "@/utils/dateUtils";
import { getRoleColor } from "@/utils/colors";
import { Toaster } from "sonner";
import { RichTextEditor } from "@/components/RichTextEditor";
import { PaginationControls } from "@/components/PaginationControls";

const COMMENTS_PER_PAGE = 10;
const getOptimizedAvatarUrl = (
  url: string | null | undefined,
  size: number
): string | undefined => {
  if (!url) {
    return undefined;
  }
  return `${url}?width=${size}&height=${size}&quality=85resize=cover`;
};

const DisabledCommentForm = ({ message }: { message: string }) => (
  <Card className="dark:bg-slate-800 border-gray-400/50">
    <CardContent className="p-5 text-center text-gray-500 dark:text-gray-400">
      <p>{message}</p>
    </CardContent>
  </Card>
);

const CommentItem = ({
  comment,
  user,
  onDelete,
  onUpdate,
}: {
  comment: Comment;
  user: UserWithProfile | null;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (content.trim() === "" || content.trim() === comment.content) {
      setIsEditing(false);
      setContent(comment.content);
      return;
    }
    setIsSubmitting(true);
    await onUpdate(comment.id, content);
    setIsSubmitting(false);
    setIsEditing(false);
  };

  return (
    <Card key={comment.id} className="dark:bg-slate-800 border-gray-400/50">
      <CardContent className="p-5 flex gap-4">
        <Link href={`/profile/${comment.profiles.username}`}>
          <Avatar>
            <AvatarImage
              src={getOptimizedAvatarUrl(comment.profiles.avatar_url, 40)}
              alt={`Avatar de ${comment.profiles.username}`}
            />
            <AvatarFallback>
              {comment.profiles.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <Link href={`/profile/${comment.profiles.username}`}>
              <p
                className={`font-semibold ${getRoleColor(
                  comment.profiles.role
                )} hover:underline`}
              >
                {comment.profiles.username}
              </p>
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-700 dark:text-gray-400">
                {formatPostTimestamp(comment.created_in)}
              </p>
              {user && user.id === comment.author_id && !isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 text-blue-400" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onDelete(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <RichTextEditor content={content} setContent={setContent} />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="mt-2 prose dark:prose-invert prose-sm max-w-none prose-ol:list-decimal prose-ul:list-disc"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
              {comment.updated_in &&
                new Date(comment.updated_in) > new Date(comment.created_in) && (
                  <p className="text-xs text-gray-400 italic mt-1">
                    Editado{" "}
                    {formatPostTimestamp(comment.updated_in).toLowerCase()}
                  </p>
                )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CommentList = ({
  topic,
  user,
  handlers,
}: {
  topic: TopicDetails;
  user: UserWithProfile | null;
  handlers: CommentHandlers;
}) => (
  <div className="space-y-4">
    {topic.comentarios.map((comment) => (
      <CommentItem
        key={comment.id}
        comment={comment}
        user={user}
        onDelete={handlers.handleDeleteComment}
        onUpdate={handlers.handleUpdateComment}
      />
    ))}
  </div>
);

const TopicView = ({
  topic,
  user,
  handlers,
  isSubmitting,
}: {
  topic: TopicDetails;
  user: UserWithProfile | null;
  handlers: TopicHandlers;
  isSubmitting: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: topic.title,
    content: topic.content,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlers.handleUpdateTopic(editData);
    setIsEditing(false);
  };

  return (
    <Card className="bg-white border-gray-100/50 dark:bg-slate-800 border-gray400/50">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="p-6">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="content">Conteúdo</Label>
              <RichTextEditor
                content={editData.content}
                setContent={(newContent) =>
                  setEditData({ ...editData, content: newContent })
                }
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      ) : (
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{topic.title}</h1>
            {user && user.id === topic.author_id && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handlers.handleDeleteTopic}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isSubmitting ? "..." : "Deletar"}
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Link href={`/profile/${topic.profiles.username}`}>
              <Avatar>
                <AvatarImage
                  src={getOptimizedAvatarUrl(topic.profiles.avatar_url, 48)}
                  alt={`Avatar de ${topic.profiles.username}`}
                />
                <AvatarFallback>
                  {topic.profiles.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/profile/${topic.profiles.username}`}>
                <p
                  className={`font-semibold ${getRoleColor(
                    topic.profiles.role
                  )} hover:underline`}
                >
                  {topic.profiles.username}
                </p>
              </Link>
              <p className="text-xs text-gray-700 dark:text-gray-400">
                Postado {formatPostTimestamp(topic.created_in).toLowerCase()}
              </p>
              {topic.updated_in &&
                new Date(topic.updated_in) > new Date(topic.created_in) && (
                  <p className="text-xs text-gray-300 italic mt-1">
                    Atualizado{" "}
                    {formatPostTimestamp(topic.updated_in).toLowerCase()}
                  </p>
                )}
            </div>
          </div>
          <div
            className="prose dark:prose-invert max-w-none prose-ol:list-decimal prose-ul:list-disc"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default function TopicPage() {
  const router = useRouter();
  const {
    topic,
    isLoading,
    error,
    user,
    category,
    newCommentContent,
    setNewCommentContent,
    isSubmitting,
    handlers,
    canCreateComment,
    isCheckingComment,
    addCommentImage,
    totalComments,
    currentPage,
    handlePageChange,
  } = useTopicPage();

  useEffect(() => {
    if (topic && category && topic.category !== category) {
      router.replace("/not-found");
    }
  }, [topic, category, router]);

  useEffect(() => {
    if (!topic) return;

    const setupSpoilers = () => {
      const spoilerBlocks = document.querySelectorAll(
        ".prose blockquote:not(.spoiler-initialized)"
      );

      spoilerBlocks.forEach((spoiler) => {
        spoiler.classList.add("spoiler-initialized");

        const originalContent = spoiler.innerHTML;

        spoiler.innerHTML = "";

        const header = document.createElement("div");
        header.className = "spoiler-header";
        header.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Spoiler (clique para mostrar/esconder)</span>
        `;

        const content = document.createElement("div");
        content.className = "spoiler-content";
        content.innerHTML = originalContent;

        spoiler.appendChild(header);
        spoiler.appendChild(content);

        header.addEventListener("click", () => {
          spoiler.classList.toggle("spoiler-open");
        });
      });
    };

    setupSpoilers();
  }, [topic]);
  const categoryTitles: { [key: string]: string } = {
    downloads: "Downloads",
    manuals: "Manuais",
    "general-discussions": "Discussões Gerais",
    members: "Área dos Membros",
    subscribe: "Inscrições",
    updates: "Atualizações",
  };

  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);
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
  if (!topic || (category && topic.category !== category)) {
    return null;
  }

  const renderCommentBox = () => {
    if (!user) {
      return (
        <DisabledCommentForm message="É necessário estar logado para comentar." />
      );
    }
    if (isCheckingComment) {
      return (
        <DisabledCommentForm message="Verificando permissão para comentar..." />
      );
    }
    if (canCreateComment === false) {
      return (
        <DisabledCommentForm message="Você não pode comentar nesta seção." />
      );
    }
    if (canCreateComment === true) {
      return (
        <PublishForm
          type="comment"
          onSubmit={handlers.handleCommentSubmit}
          isSubmitting={isSubmitting}
          content={newCommentContent}
          setContent={setNewCommentContent}
          onImageAdd={addCommentImage}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="min-h-screen font-sans p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="mb-4">
            <Button variant="outline" asChild>
              <Link href={`/topics/${category}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para{" "}
                {categoryTitles[category] || category.replace(/-/g, " ")}{" "}
              </Link>
            </Button>
          </div>
          <TopicView
            topic={topic}
            user={user}
            handlers={handlers}
            isSubmitting={isSubmitting}
          />
          <Separator className="bg-gray-700" />
          <h2 className="text-2xl font-semibold">
            Comentários ({totalComments})
          </h2>
          <CommentList topic={topic} user={user} handlers={handlers} />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          {renderCommentBox()}
        </div>
      </div>
    </>
  );
}
