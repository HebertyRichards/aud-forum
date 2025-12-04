import { z } from "zod";

export const recentPostsSchema = z.object({
  id: z.number(),
  title: z.string(),
  topic_slug: z.string(),
  created_in: z.string(),
  category_name: z.string(),
  category_slug: z.string(),
  author_username: z.string(),
  author_avatar: z.string().nullish(),
  comment_count: z.number(),
  role: z.string(),
});

export const TopcSChema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  created_in: z.string(),
  profiles: z.object({
    username: z.string(),
    avatar_url: z.string().nullish(),
  }),
  comentarios: z.array(
    z.object({
      count: z.number(),
    })
  ),
});

export const CommentSchema = z.object({
  id: z.number(),
  content: z.string(),
  created_in: z.string(),
  updated_in: z.string().nullish(),
  author_id: z.string(),
  profiles: z.object({
    username: z.string(),
    avatar_url: z.string().nullish(),
    role: z.string(),
  }),
});

export const TopicDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  category: z.string(),
  created_in: z.string(),
  updated_in: z.string().optional().nullish(),
  author_id: z.string(),
  profiles: z.object({
    username: z.string(),
    avatar_url: z.string().nullish(),
    role: z.string(),
  }),
  comentarios: z.array(CommentSchema),
});

export const ForumMemberSchema = z.object({
  username: z.string(),
  role: z.string(),
});

export const DashboardSchema = z.object({
  stats: z.object({
    activeMembers: z.number(),
    totalPosts: z.number(),
    totalTopics: z.number(),
    newestMember : (ForumMemberSchema),
  }),
});

export type RecentPost = z.infer<typeof recentPostsSchema>;
export type TopicSummary = z.infer<typeof TopcSChema>;
export type Comment = z.infer<typeof CommentSchema>;
export type TopicDetails = z.infer<typeof TopicDetailsSchema>;
export type ForumMember = z.infer<typeof ForumMemberSchema>;
export type DashboardData = z.infer<typeof DashboardSchema>;