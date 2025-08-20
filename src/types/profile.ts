export interface UpdateDataProps {
  profile: Partial<UserProfile>;
  onSuccess?: () => void;
}

export interface UserProfileLayoutProps {
  profile: UserProfile | null;
  isLoading: boolean;
  isUpdating?: boolean;
  error: string | null;
  isOwnProfile: boolean;
  onSuccessUpdate: () => void;
  stats?: FollowStats | null;
  isFollowing?: boolean;
  isFollowLoading?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
}

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
}

export interface FollowStats {
  followers_count: number;
  following_count: number;
}

export interface UpdateContactsProps {
  profile: Partial<UserProfile>;
  onSuccess?: () => void;
}


export interface UpdateAvatarProps {
  onSuccess: () => void;
  currentAvatarUrl?: string | null;
}

export interface FollowerInfo {
  id: string;
  username: string;
  avatar_url: string | null;
}