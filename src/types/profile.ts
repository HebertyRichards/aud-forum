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
  mensagens_count?: number
}

export interface UserPreview {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface FollowStats {
  followers_count: number;
  following_count: number;
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

export interface UpdateDataProps {
  profile: Partial<UserProfile>;
  onSuccess?: () => void;
}

export interface UpdateContactsProps {
  profile: Partial<UserProfile>;
  onSuccess?: () => void;
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
  userId: string;
  type: "followers" | "following";
}

export interface FollowListModalProps {
  username: string;
  listType: "followers" | "following";
  onClose: () => void;
}
