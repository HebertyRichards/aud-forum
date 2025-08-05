export type OnlineUser = {
    name: string;
    status: "online" | "away";
    avatar: string;
  };

  export type RawOnlineUser = {
    profiles: {
      username: string;
    };
  };

  
export type MemberRole = 'default' | 'auditore' | 'leader';
export type Member = {
  id: number;
  avatar: string;
  username: string;
  role: MemberRole;
  humor?: string;
  joinDate: string;
  lastVisit: string;
  messages: number;
  hasPrivateMessage: boolean;
  hasWebsite: boolean;
};

export interface ForumStatsProps {
    stats: {
      activeMembers: number;
      totalPosts: string;
      totalTopics: number;
      newestMember: string;
    };
  }
  
  export interface ProfileData {
    username: string;
  }

  export interface UserProfile {
    username: string;
    gender?: string;
    birthdate?: string;
    location?: string;
    website?: string;
    joined_at?: string;
    last_login?: string;
    total_posts?: number;
    avatarUrl?: string;
    role?: string;
  }