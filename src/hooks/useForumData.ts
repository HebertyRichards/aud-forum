import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "@/schema/forum";
import { categoryService } from "@/services";

export const useForumData = () => {
  return useQuery<DashboardData>({
    queryKey: ["forumDashboardData"],
    queryFn: categoryService.getForumDashboardData,
    staleTime: 5 * 60 * 1000,
  });
};
