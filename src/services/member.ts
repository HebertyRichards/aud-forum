import { Member, ApiMember } from "@/types/users";
export async function getAllMembers(): Promise<Member[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log("Tentando buscar dados de:", `${API_URL}/profile/user/all`);
  try {
    const res = await fetch(`${API_URL}/profile/user/all`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Falha ao buscar os membros.");
    }

    const data: ApiMember[] = await res.json();

    const transformedData: Member[] = data.map((apiMember, index) => ({
      id: index + 1,
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

    return transformedData;
  } catch (error: unknown) {
    throw error;
  }
}
