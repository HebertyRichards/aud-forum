import { ReactElement } from "react";
import {
  type LucideIcon,
} from "lucide-react";

export interface ApiCategory {
  slug: string;
  name: string;
}

export interface TopicSummary {
  id: number;
  title: string;
  slug: string;
  category: string;
  created_in: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  comentarios: [{ count: number }];
}

export interface Comment {
  id: number;
  content: string;
  created_in: string;
  updated_in?: string | null;
  author_id: string; 
  profiles: {
    username: string;
    avatar_url: string | null;
    role: string;
  };
}

export interface TopicDetails {
  id: number;
  title: string;
  content: string;
  category: string;
  created_in: string;
  updated_in?: string | null;
  author_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
    role: string;
  };
  comentarios: Comment[];
}


export interface NewTopicData {
  title: string;
  content: string;
  category: string;
}

export interface UpdateTopicData {
  title?: string;
  content?: string;
}

export interface NewCommentData {
  content: string;
  topicId: number;
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

export interface TopicHandlers {
  handleDeleteTopic: () => void;
  handleUpdateTopic: (editData: UpdateTopicData) => void;
}

export interface RecentPost {
  id: number;
  title: string;
  topic_slug: string;
  created_in: string;
  category_name: string;
  category_slug: string;
  author_username: string;
  author_avatar: string | null;
  comment_count: number;
  role: string;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
