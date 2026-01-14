import { Member } from "@/schema/forum";
import { handleApiError } from "@/utils/apiErrors";

export async function getAllMembers(
  page: number
): Promise<{ members: Member[]; totalCount: number } | undefined> {
  const limit = 20;
  try {
    const res = await fetch(`/api/user/user/all?page=${page}&limit=${limit}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Falha ao buscar os membros.");
    }
    const { data, totalCount }: { data: Member[]; totalCount: number } =
      await res.json();

    const transformedData: Member[] = data.map((apiMember, index) => ({
      id: apiMember.id,
      rowNumber: (page - 1) * limit + index + 1,
      avatar_url: apiMember.avatar_url,
      username: apiMember.username,
      role: apiMember.role as Member["role"],
      joined_at: apiMember.joined_at,
      last_login: apiMember.last_login,
      messages: apiMember.mensagens_count ?? 0,
    }));

    return { members: transformedData, totalCount };
  } catch (error) {
    handleApiError(error, "Falha ao buscar os membros.");
  }
}
