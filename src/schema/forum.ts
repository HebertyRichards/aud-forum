import { z } from "zod";

export const MemberSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.string(),
  avatar_url: z.string().nullish(),
  joined_at: z.string(),
  last_login: z.string().nullish(),
  mensagens_count: z.number().optional(),
  messages: z.number(),
  rowNumber: z.number(),
});

export const OnlineUserSchema = z.object({
  username: z.string(),
  role: z.string(),
  avatar_url: z.string().nullish(),
});

export const RawOnlineUserSchema = z.object({
  last_seen_at: z.string(),
  profiles: OnlineUserSchema,
});

export const newTopicSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string(),
});

export const updateTopicSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export const NewCommentSchema = z.object({
  content: z.string().optional(),
  topicId: z.number().optional(),
});


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

export const TopicSummarySchema = z.object({
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
    newestMember: ForumMemberSchema,
  }),
  recentPosts: z.array(recentPostsSchema),
  lastUser: ForumMemberSchema.nullish(),
  onlineUsers: z.array(RawOnlineUserSchema),
});

export type RecentPost = z.infer<typeof recentPostsSchema>;
export type TopicSummary = z.infer<typeof TopicSummarySchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type TopicDetails = z.infer<typeof TopicDetailsSchema>;
export type ForumMember = z.infer<typeof ForumMemberSchema>;
export type DashboardData = z.infer<typeof DashboardSchema>;
export type NewTopic = z.infer<typeof newTopicSchema>;
export type UpdateTopic = z.infer<typeof updateTopicSchema>;
export type NewComment = z.infer<typeof NewCommentSchema>;
export type OnlineUser = z.infer<typeof OnlineUserSchema>;
export type RawOnlineUser = z.infer<typeof RawOnlineUserSchema>;
export type Member = z.infer<typeof MemberSchema>;