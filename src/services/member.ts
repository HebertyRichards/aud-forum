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
      id: (page - 1) * limit + index + 1,
      avatar: `https://ui-avatars.com/api/?name=${apiMember.username}&background=random`,
      username: apiMember.username,
      role: apiMember.role as Member['role'],
      joinDate: apiMember.joined_at,
      lastVisit: apiMember.last_login,
      messages: 0, 
      hasPrivateMessage: false, 
      hasWebsite: false, 
      humor: '', 
    }));

    return { members: transformedData, totalCount }
    
  } catch (error: unknown) {
    throw error;
  }
}
