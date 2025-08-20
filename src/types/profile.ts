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

export interface UpdateContactsProps {
  profile: Partial<UserProfile>;
  onSuccess?: () => void;
}


export interface UpdateAvatarProps {
  onSuccess: () => void;
}