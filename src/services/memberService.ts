import { Member } from "@/schema/forum";
import { httpClient } from "./core/httpClient";

interface GetAllMembersResponse {
  data: Member[];
  totalCount: number;
}

export interface MembersResult {
  members: Member[];
  totalCount: number;
}

export const memberService = {
  async getAllMembers(page: number, limit: number = 20): Promise<MembersResult> {
    const response = await httpClient.get<GetAllMembersResponse>(
      `/user/user/all?page=${page}&limit=${limit}`
    );

    if (!response) {
      return { members: [], totalCount: 0 };
    }

    const transformedData: Member[] = response.data.map((apiMember, index) => ({
      id: apiMember.id,
      rowNumber: (page - 1) * limit + index + 1,
      avatar_url: apiMember.avatar_url,
      username: apiMember.username,
      role: apiMember.role as Member["role"],
      joined_at: apiMember.joined_at,
      last_login: apiMember.last_login,
      messages: (apiMember as Member & { mensagens_count?: number }).mensagens_count ?? 0,
    }));

    return { members: transformedData, totalCount: response.totalCount };
  },
};
