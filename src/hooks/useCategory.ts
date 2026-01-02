import { useQuery } from "@tanstack/react-query";

interface ApiCategory {
  slug: string;
  name: string;
  description?: string;
}

const fetchCategory = async (): Promise<ApiCategory[]> => {
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

export const useCategory = () => {
  return useQuery<ApiCategory[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategory,
    staleTime: 60 * 60 * 1000,
  });
};
