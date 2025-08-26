import {
  type LucideIcon,
} from "lucide-react";
import { ReactElement } from "react";

export type DownloadCardProps = {
    icon: React.ReactNode;
    title: string;
    author: string;
    postDate: string;
    replies: number;
    views: number;
  };

  export type Topic = {
    id: number;
    icon: LucideIcon;
    title: string;
    route: string;
    lastPostInfo: string;
    author: string;
    authorColorClass: string;
    postCount: number;
    hasInfoIcon?: boolean;
  };

  export type Category = {
    id: string;
    title: string;
    topics: Topic[];
  };

  export type RecentPost = {
    id: number;
    title:string;
    author: string;
    category: string;
    replies: number;
    views: number;
    time: string;
    avatar: string;
    isPinned?: boolean;
    isHot?: boolean;
  };

  export interface RecentPostsProps {
    posts: RecentPost[];
  }

  export interface Forum {
    id: string;
    name: string;
  }

  export interface PublishTopicFormProps {
    forums: Forum[];
    onSubmit: (data: {
      icon: string;
      title: string;
      content: string;
      forumId: string;
    }) => void;
    isSubmitting?: boolean;
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

  export interface ForumCategoryListProps {
    categories: Category[];
  }

  export interface TopicFormData {
    title: string;
    content: string;
    category: string;
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
    onSubmit: PublishFormProps<"topic">["onSubmit"];
    isSubmitting: boolean;
    error: string | null; 
  }

 export interface EmptyStateProps {
    onNewTopicClick: () => void;
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

  export interface TopicSummary {
    id: number;
    title: string;
    slug: string;
    created_in: string;
    profiles: {
      username: string;
      avatar_url: string;
    };
    comentarios: [{ count: number }];
  }

  export interface Comment {
    id: number;
    content: string;
    created: string;
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
    profiles: {
      username: string;
      avatar_url: string | null;
      role: string;
    };
    comentarios: Comment[];
  }

  export interface ApiCategory {
    slug: string;
    name: string;
  }
  
 export interface UiCategory {
    href: string;
    title: string;
    description: string;
    icon: ReactElement;
  }
