import { UserProfile } from "@/schema/user";
import { Member } from "@/schema/forum";

type ApiMember = Pick<
  UserProfile,
  | "id"
  | "username"
  | "role"
  | "joined_at"
  | "last_login"
  | "avatar_url"
  | "mensagens_count"
>;

export async function getAllMembers(
  page: number
): Promise<{ members: Member[]; totalCount: number }> {
  const limit = 20;
  try {
    const res = await fetch(`/api/user/user/all?page=${page}&limit=${limit}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Falha ao buscar os membros.");
    }
    const { data, totalCount }: { data: ApiMember[]; totalCount: number } =
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
  } catch (error: unknown) {
    throw error;
  }
}
