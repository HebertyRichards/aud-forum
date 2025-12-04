import { z } from 'zod';

export const UserSchema = z.object({
id: z.string(),
username: z.string(),
avatar_url: z.string().nullish(),
gender : z.string().optional().nullish(),
role: z.string(),
joined_at: z.string(),
last_login: z.string().nullish(),
total_posts: z.number().optional(),
birthdate: z.string().optional().nullish(),
location: z.string().optional().nullish(),
website: z.string().optional().nullish(),
facebook: z.string().optional().nullish(),
instagram: z.string().optional().nullish(),
discord: z.string().optional().nullish(),
steam: z.string().optional().nullish(),
mensagens_count: z.number().optional(),
});

export const UserPreview = z.object({
id: z.string(),
username: z.string(),
avatar_url: z.string().nullish(),
role: z.string(),
});

export const FollowStatsSchema = z.object({
followers_count: z.number(),
following_count: z.number(),
});

export const UserStatsSchema = z.object({
topicsCount: z.number(),
topicsPerDay: z.string(),
topicsPercentage: z.string(),
lastTopicDate: z.string().nullish(),
messagesCount: z.number(),
messagesPerDay: z.string(),
messagesPercentage: z.string(),
lastPostDate: z.string().nullish(),
followersCount: z.number(),
memberSince: z.string(),
lastLogin: z.string().nullish(),
});

export const FollowStateSchema = z.object({
isFollowing: z.boolean().optional(),
isFollowLoading: z.boolean().optional(),
stats : FollowStatsSchema.optional().nullish(),
});


export type UserProfile = z.infer<typeof UserSchema>;
export type UserPreview = z.infer<typeof UserPreview>;
export type FollowStats = z.infer<typeof FollowStatsSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type FollowState = z.infer<typeof FollowStateSchema & {
  onFollow?: () => void;
  onUnfollow?: () => void;
}>;
