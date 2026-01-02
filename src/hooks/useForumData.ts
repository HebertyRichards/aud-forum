import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "@/schema/forum";

const fetchForumDashboardData = async (): Promise<DashboardData> => {
  const res = await fetch(`/api/forum/data`);
  if (!res.ok) {
    throw new Error("Erro ao carregar os dados do painel do fórum.");
  }
  return res.json();
};

export const useForumData = () => {
  return useQuery<DashboardData>({
    queryKey: ["forumDashboardData"],
    queryFn: fetchForumDashboardData,
    staleTime: 5 * 60 * 1000,
  });
};
