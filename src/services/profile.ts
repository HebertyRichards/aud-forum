import { UserStats } from "@/schema/user";
import { TopicSummary } from "@/schema/forum";

export async function getUserStats(username: string): Promise<UserStats> {
  try {
    const response = await fetch(`/api/statistic/profile/${username}/stats`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar as estatísticas do usuário.");
    }
    return await response.json();
  } catch {
    throw new Error("Falha ao buscar as estatísticas do usuário.");
  }
}

export async function getTopicsByAuthor(username: string): Promise<TopicSummary[]> {
  try {
    const response = await fetch(`/api/statistic/profile/${username}/topics`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar os tópicos do usuário.");
    }
    return await response.json();
  } catch {
    throw new Error("Falha ao buscar os tópicos do usuário.");
  }
}