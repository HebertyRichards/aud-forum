import { useQuery } from "@tanstack/react-query";
import { categoryService, ApiCategory } from "@/services";



export const useCategory = () => {
  return useQuery<ApiCategory[], Error>({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
    staleTime: 60 * 60 * 1000,
  });
};
