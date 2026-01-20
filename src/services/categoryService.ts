import { DashboardData } from "@/schema/forum";
import { httpClient } from "./core/httpClient";

export interface ApiCategory {
  slug: string;
  name: string;
  description?: string;
}

export const categoryService = {
  async getCategories(): Promise<ApiCategory[]> {
    const data = await httpClient.get<ApiCategory[]>("/categories");
    return data ?? [];
  },

  async getForumDashboardData(): Promise<DashboardData> {
    const response = await httpClient.get<DashboardData>("/forum/data");
    if (!response) {
      throw new Error("Failed to fetch forum dashboard data");
    }
    return response;
  },
};
