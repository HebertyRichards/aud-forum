import {
  type LucideIcon,
} from "lucide-react";

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
    title: string;
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
    icon: LucideIcon;
    title: string;
    lastPostInfo: string;
    author: string;
    authorColorClass: string;
    postCount: number;
  }

  export interface ForumCategoryListProps {
    categories: Category[];
  }
