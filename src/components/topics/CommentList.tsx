import { TopicDetails } from "@/schema/forum";
import { UserWithProfile } from "@/types/autentication";
import { CommentItem } from "./CommentItem";

interface CommentHandlers {
  handleDeleteComment: (commentId: number) => void;
  handleUpdateComment: (commentId: number, content: string) => void;
}

interface CommentListProps {
  topic: TopicDetails;
  user: UserWithProfile | null;
  handlers: CommentHandlers;
}

export const CommentList = ({ topic, user, handlers }: CommentListProps) => (
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
