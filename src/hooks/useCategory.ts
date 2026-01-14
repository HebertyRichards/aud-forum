import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "@/app/api/endpoints/category";

type ApiCategory = {
  slug: string;
  name: string;
  description?: string;
};

export const useCategory = () => {
  return useQuery<ApiCategory[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategory,
    staleTime: 60 * 60 * 1000,
  });
};
