import { UserStats } from "@/types/profile";
import { TopicSummary } from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUserStats(username: string): Promise<UserStats> {
  const response = await fetch(`${API_URL}/statistic/profile/${username}/stats`);

  if (!response.ok) {
    throw new Error("Falha ao buscar as estatísticas do usuário.");
  }

  return response.json();
}

export async function getTopicsByAuthor(username: string): Promise<TopicSummary[]> {
  const response = await fetch(`${API_URL}/statistic/profile/${username}/topics`);

  if (!response.ok) {
    throw new Error("Falha ao buscar os tópicos do usuário.");
  }

  return response.json();
}