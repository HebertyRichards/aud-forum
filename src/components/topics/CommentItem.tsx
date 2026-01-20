import { useState } from "react";
import Link from "next/link";
import { Comment } from "@/schema/forum";
import { UserWithProfile } from "@/types/autentication";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatPostTimestamp } from "@/utils/dateUtils";
import { getRoleColor } from "@/utils/colors";
import { RichTextEditor } from "@/components/RichTextEditor";
import sanitizeHtml from "sanitize-html";
import { useTranslations } from "next-intl";

interface CommentItemProps {
  comment: Comment;
  user: UserWithProfile | null;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
}

const getOptimizedAvatarUrl = (
  url: string | null | undefined,
  size: number
): string | undefined => {
  if (!url) {
    return undefined;
  }
  return `${url}?width=${size}&height=${size}&quality=85resize=cover`;
};

export const CommentItem = ({
  comment,
  user,
  onDelete,
  onUpdate,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tTopics = useTranslations("topics");
  const tCommon = useTranslations("common");
  const tProfile = useTranslations("profile");

  const tagsWithoutEmptyTags = comment.content.replace(
    /<[^/>][^>]*><\/[^>]+>/g,
    ""
  );
  const formatedText = sanitizeHtml(tagsWithoutEmptyTags, {});

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
    <Card
      key={comment.id}
      className="bg-slate-800 border-slate-700/50 text-white"
    >
      <CardContent className="p-5 flex gap-4">
        <Link href={`/profile/${comment.profiles.username}`}>
          <Avatar>
            <AvatarImage
              src={getOptimizedAvatarUrl(comment.profiles.avatar_url, 40)}
              alt={tProfile("avatarAlt", { name: comment.profiles.username })}
            />
            <AvatarFallback className="bg-slate-600">
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
              <p className="text-xs text-gray-400">
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
                  {isSubmitting ? tCommon("loading") : tCommon("save")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  {tCommon("cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="mt-2 prose dark:prose-invert prose-sm max-w-none prose-ol:list-decimal prose-ul:list-disc"
                dangerouslySetInnerHTML={{ __html: formatedText }}
              />
              {comment.updated_in &&
                new Date(comment.updated_in) > new Date(comment.created_in) && (
                  <p className="text-xs text-slate-400 italic mt-1">
                    {tTopics("edited")}{" "}
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
