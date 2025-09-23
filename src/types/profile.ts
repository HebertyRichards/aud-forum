export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string | null;
  role: string;
  gender?: string;
  birthdate?: string;
  location?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  discord?: string;
  steam?: string;
  joined_at: string;
  last_login: string;
  total_posts?: number;
  mensagens_count?: number;
}

export interface UserPreview {
  id: string;
  username: string;
  avatar_url: string | null;
  role: string;
}

export interface FollowStats {
  followers_count: number;
  following_count: number;
}

export interface UserStats {
  topicsCount: number;
  topicsPerDay: string;
  topicsPercentage: string;
  lastTopicDate: string | null;
  messagesCount: number;
  messagesPerDay: string;
  messagesPercentage: string;
  lastPostDate: string | null;
  followersCount: number;
  memberSince: string;
  lastLogin: string | null;
}

interface FollowState {
  isFollowing?: boolean;
  isFollowLoading?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  stats?: FollowStats | null;
}

export interface UserProfileLayoutProps {
  profile: UserProfile | null;
  isLoading: boolean;
  isUpdating?: boolean;
  error: string | null;
  isOwnProfile: boolean;
  onSuccessUpdate: () => void;
  followState: FollowState;
}

type ProfileTabCommonProps = {
  profile: UserProfile | null;
  isOwnProfile: boolean;
  onSuccessUpdate: () => void;
};

export type ProfileInfoTabProps = ProfileTabCommonProps & {
  isUpdating?: boolean;
};

export type ProfileContactTabProps = ProfileTabCommonProps;

export interface ProfileUpdateFormProps {
  profile: Partial<UserProfile>;
  onSuccess: () => void;
}

export interface UpdateAvatarProps {
  onSuccess: () => void;
  currentAvatarUrl?: string | null;
}

export interface FollowButtonProps {
  profileUsername: string;
  isFollowing: boolean;
  followersCount: number;
}

export interface FollowerListProps {
  username: string;
  type: "followers" | "following";
}

export interface FollowListModalProps {
  username: string;
  listType: "followers" | "following";
  onClose: () => void;
  isOwnProfile: boolean;
}
