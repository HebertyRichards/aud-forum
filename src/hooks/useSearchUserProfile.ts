import { followService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth";

export const useSearchUserProfile = () => {
    const auth = useAuth();
    const username = auth.user?.username;
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ["searchUserProfile", username],
        queryFn: () => followService.searchUserProfile(username!),
        enabled: !!username,
    });
    return { data, isLoading, isFetching, error };
};
