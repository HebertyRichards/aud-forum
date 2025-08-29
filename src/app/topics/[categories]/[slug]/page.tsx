"use client";

import { useState } from "react";
import Link from "next/link";
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
    <Card key={comment.id} className="dark:bg-gray-800 border-gray-400/50">
      <CardContent className="p-5 flex gap-4">
        <Avatar>
          <AvatarImage src={comment.profiles.avatar_url || undefined} />
          <AvatarFallback>
            {comment.profiles.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p
              className={`font-semibold ${getRoleColor(comment.profiles.role)}`}
            >
              {comment.profiles.username}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-700 dark:text-gray-500">
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
                className="mt-2 prose prose-sm prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
              {comment.updated_at &&
                new Date(comment.updated_at) > new Date(comment.created_in) && (
                  <p className="text-xs text-gray-400 italic mt-1">
                    Editado{" "}
                    {formatPostTimestamp(comment.updated_at).toLowerCase()}
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
    <Card className="bg-white border-gray-100/50 dark:bg-gray-800 border-gray400/50">
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
            <Avatar>
              <AvatarImage src={topic.profiles.avatar_url || undefined} />
              <AvatarFallback>
                {topic.profiles.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p
                className={`font-semibold ${getRoleColor(topic.profiles.role)}`}
              >
                {topic.profiles.username}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-500">
                Postado {formatPostTimestamp(topic.created_in).toLowerCase()}
              </p>
              {topic.updated_in &&
                new Date(topic.updated_in) > new Date(topic.created_in) && (
                  <p className="text-xs text-gray-400 italic mt-1">
                    Atualizado{" "}
                    {formatPostTimestamp(topic.updated_in).toLowerCase()}
                  </p>
                )}
            </div>
          </div>
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default function TopicPage() {
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
  } = useTopicPage();

  const categoryTitles: { [key: string]: string } = {
    downloads: "Downloads",
    manuals: "Manuais",
    "general-discussions": "Discussões Gerais",
    members: "Área dos Membros",
    subscribe: "Inscrições",
    updates: "Atualizações",
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
            Comentários ({topic.comentarios.length})
          </h2>
          <CommentList topic={topic} user={user} handlers={handlers} />
          {user && (
            <PublishForm
              type="comment"
              onSubmit={handlers.handleCommentSubmit}
              isSubmitting={isSubmitting}
              content={newCommentContent}
              setContent={setNewCommentContent}
            />
          )}
        </div>
      </div>
    </>
  );
}
