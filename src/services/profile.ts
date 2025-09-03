import { UserStats } from "@/types/profile";
import { TopicSummary } from "@/types/post";
import axios from "axios";

export async function getUserStats(username: string): Promise<UserStats> {
  try {
    const response = await axios.get(`/api/statistic/profile/${username}/stats`);
    return response.data;
  } catch {
    throw new Error("Falha ao buscar as estatísticas do usuário.");
  }
}

export async function getTopicsByAuthor(username: string): Promise<TopicSummary[]> {
  try {
    const response = await axios.get(`/api/statistic/profile/${username}/topics`);
    return response.data;
  } catch {
    throw new Error("Falha ao buscar os tópicos do usuário.");
  }
}