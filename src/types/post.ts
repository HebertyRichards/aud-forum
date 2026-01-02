import { ReactElement } from "react";
import { type LucideIcon } from "lucide-react";

export interface ApiCategory {
  slug: string;
  name: string;
  description?: string;
}

export interface UiCategory {
  href: string;
  title: string;
  description: string;
  icon: ReactElement;
}

export interface TopicFormData {
  title: string;
  content: string;
}

export interface CommentFormData {
  content: string;
}

export interface PublishFormProps<T extends "topic" | "comment"> {
  type: T;
  onSubmit: () => void;
  isSubmitting?: boolean;
  className?: string;
  content: string;
  setContent: (value: string) => void;
  title?: string;
  setTitle?: (value: string) => void;
  onImageAdd?: (file: File) => void;
}

export interface CreateTopicViewProps {
  onSubmit: (data: TopicFormData) => void;
  isSubmitting: boolean;
  error: string | null;
}

export interface EmptyStateProps {
  onNewTopicClick: () => void;
}

export interface ForumTopicRowProps {
  id: number;
  icon: LucideIcon;
  title: string;
  route: string;
  lastPostInfo: string;
  author: string;
  authorColorClass: string;
  postCount: number;
}

export interface CommentHandlers {
  handleDeleteComment: (commentId: number) => void;
  handleUpdateComment: (commentId: number, content: string) => void;
}

interface ForumMember {
  username: string;
  role: string;
}

