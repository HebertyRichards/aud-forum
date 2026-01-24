"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TopicDetails, UpdateTopic } from "@/schema/forum";
import { UserWithProfile } from "@/types/autentication";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPostTimestamp } from "@/utils/dateUtils";
import { getRoleColor } from "@/utils/colors";
import { RichTextEditor } from "@/components/RichTextEditor";
import sanitizeHtml from "sanitize-html";
import { useTranslations } from "next-intl";

interface TopicHandlers {
  handleDeleteTopic: () => void;
  handleUpdateTopic: (editData: UpdateTopic) => void;
}

interface TopicViewProps {
  topic: TopicDetails;
  user: UserWithProfile | null;
  handlers: TopicHandlers;
  isSubmitting: boolean;
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

const getOptimizedAvatarUrl = (
  url: string | null | undefined,
  size: number
): string | undefined => {
  if (!url) {
    return undefined;
  }
  return `${url}?width=${size}&height=${size}&quality=85resize=cover`;
};

export const TopicView = ({
  topic,
  user,
  handlers,
  isSubmitting,
}: TopicViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: topic.title,
    content: topic.content,
  });

  const t = useTranslations("topics");
  const tCommon = useTranslations("common");

  const isMobile = useMediaQuery("(max-width: 768px)");
  const tagsWithoutEmptyTags = topic.content.replace(
    /<[^/>][^>]*><\/[^>]+>/g,
    ""
  );
  const formatedText = sanitizeHtml(tagsWithoutEmptyTags, {});
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlers.handleUpdateTopic(editData);
    setIsEditing(false);
  };

  const renderActionButtons = () => {
    if (!user || user.id !== topic.author_id) return null;
    if (isMobile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              {tCommon("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handlers.handleDeleteTopic}
              disabled={isSubmitting}
              className="text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isSubmitting ? "..." : tCommon("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Button
          className="dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 bg-slate-200 border-slate-200 hover:bg-slate-100"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="h-4 w-4 mr-2" />
          {tCommon("edit")}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handlers.handleDeleteTopic}
          disabled={isSubmitting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isSubmitting ? "..." : tCommon("delete")}
        </Button>
      </div>
    );
  };

  return (
    <Card className="bg-slate-200 border-slate-200 dark:border-slate-700 dark:bg-slate-800">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="p-6">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">{t("title")}</Label>
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
              <Label htmlFor="content">{t("content")}</Label>
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
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? tCommon("loading") : tCommon("save")}
            </Button>
          </div>
        </form>
      ) : (
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl md:text-3xl font-bold mr-4">
              {topic.title}
            </h1>
            {renderActionButtons()}
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Link href={`/profile/${topic.profiles.username}`}>
              <Avatar>
                <AvatarImage
                  src={getOptimizedAvatarUrl(topic.profiles.avatar_url, 48)}
                  alt={`Avatar de ${topic.profiles.username}`}
                />
                <AvatarFallback className="dark:bg-slate-600 bg-slate-100">
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
              <p className="text-xs dark:text-gray-400 text-gray-700">
                {t("postedBy")} {formatPostTimestamp(topic.created_in).toLowerCase()}
              </p>
              {topic.updated_in &&
                new Date(topic.updated_in) > new Date(topic.created_in) && (
                  <p className="text-xs dark:text-gray-300 text-gray-700 italic mt-1">
                    {tCommon("edit")}{" "}
                    {formatPostTimestamp(topic.updated_in).toLowerCase()}
                  </p>
                )}
            </div>
          </div>
          <div
            className="prose dark:prose-invert max-w-none prose-ol:list-decimal prose-ul:list-disc"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(topic.content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
                allowedAttributes: {
                  ...sanitizeHtml.defaults.allowedAttributes,
                  "*": ["style", "class"],
                },
              }),
            }}
          />
        </CardContent>
      )}
    </Card>
  );
};
