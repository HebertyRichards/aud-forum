import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "@/schema/forum";
import { fetchForumDashboardData } from "@/app/api/endpoints/category";

export const useForumData = () => {
  return useQuery<DashboardData>({
    queryKey: ["forumDashboardData"],
    queryFn: fetchForumDashboardData,
    staleTime: 5 * 60 * 1000,
  });
};
