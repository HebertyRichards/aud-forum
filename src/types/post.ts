import { ReactElement } from "react";


export interface ApiCategory {
  slug: string;
  name: string;
}

export interface TopicSummary {
  id: number;
  title: string;
  slug: string;
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
  created: string;
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
  created: string;
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
  onSubmit: (data: T extends "topic" ? TopicFormData : CommentFormData) => void;
  isSubmitting?: boolean;
  className?: string;
  error?: string | null; 
}

export interface CreateTopicViewProps {
  onSubmit: (data: TopicFormData) => void;
  isSubmitting: boolean;
  error: string | null;
}

export interface EmptyStateProps {
  onNewTopicClick: () => void;
}
