import { DashboardData } from "@/schema/forum";

type ApiCategory = {
  slug: string;
  name: string;
  description?: string;
};

export const fetchCategory = async (): Promise<ApiCategory[]> => {
  const response = await fetch("/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const data = await response.json();
  return data ?? [];
};

export const fetchForumDashboardData = async (): Promise<DashboardData> => {
  const res = await fetch(`/api/forum/data`);
  if (!res.ok) {
    throw new Error("Erro ao carregar os dados do painel do fórum.");
  }
  return res.json();
};
