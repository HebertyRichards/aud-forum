import { useQuery } from "@tanstack/react-query";
import { ApiCategory } from "@/types/post";
import axios from "axios";

const fetchCategory = async (): Promise<ApiCategory[]> => {
  const response = await axios.get("/api/categories");
  return response.data ?? [];
};

export const useCategory = () => {
  return useQuery<ApiCategory[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategory,
    staleTime: 60 * 60 * 1000,
  });
};
