import { Member, ApiMember } from "@/types/users";
export async function getAllMembers(page: number): Promise<{ members: Member[], totalCount: number }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const limit = 20;
  
  try {
    const res = await fetch(`${API_URL}/profile/user/all?page=${page}&limit=${limit}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Falha ao buscar os membros.");
    }

    const { data, totalCount }: { data: ApiMember[], totalCount: number } = await res.json();

    const transformedData: Member[] = data.map((apiMember, index) => ({
      id: apiMember.id,
      rowNumber: (page - 1) * limit + index + 1,
      avatar_url: apiMember.avatar_url,
      username: apiMember.username,
      role: apiMember.role as Member['role'],
      joined_at: apiMember.joined_at,
      last_login: apiMember.last_login,
      messages: 0, 

    }));

    return { members: transformedData, totalCount }
    
  } catch (error: unknown) {
    throw error;
  }
}