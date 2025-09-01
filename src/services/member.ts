import { Member, ApiMember } from "@/types/users";
import axios from "axios";
export async function getAllMembers(page: number): Promise<{ members: Member[], totalCount: number }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const limit = 20;
  
  try {
    const res = await axios.get(`${API_URL}/user/user/all`, {
      params: { page, limit }
    });

    const { data, totalCount }: { data: ApiMember[], totalCount: number } = res.data;

    const transformedData: Member[] = data.map((apiMember, index) => ({
      id: apiMember.id,
      rowNumber: (page - 1) * limit + index + 1,
      avatar_url: apiMember.avatar_url,
      username: apiMember.username,
      role: apiMember.role as Member['role'],
      joined_at: apiMember.joined_at,
      last_login: apiMember.last_login,
      messages: apiMember.mensagens_count ?? 0, 
    }));

    return { members: transformedData, totalCount }
    
  } catch (error: unknown) {
    throw error;
  }
}