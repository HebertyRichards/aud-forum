import { UserProfile } from "./profile";

export type RawOnlineUser = {
  profiles: Pick<UserProfile, "username" | "role" | "avatar_url">;
};

export type OnlineUser = Pick<UserProfile, "username" | "role" | "avatar_url">;

export type Member = Pick<
  UserProfile,
  "id" | "username" | "role" | "avatar_url" | "joined_at" | "last_login" | "mensagens_count"
> & {
  messages: number; 
  rowNumber: number;
};


export type ApiMember = Pick<
  UserProfile,
  "id" | "username" | "role" | "joined_at" | "last_login" | "avatar_url" | "mensagens_count"
>;

export type MembersTableProps = {
  members: Member[];
  isLoading: boolean;
  error: string | null;
};

export interface MembersFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export interface MainStats {
  activeMembers: number;
  totalPosts: number;
  totalTopics: number;
}