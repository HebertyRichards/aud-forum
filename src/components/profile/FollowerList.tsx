import { useQuery } from "@tanstack/react-query";
import { UserPreview, FollowerListProps } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const fetchFollowList = async (
  username: string,
  type: "followers" | "following"
) => {
  try {
    const { data } = await axios.get<UserPreview[]>(
      `/api/follow/${username}/${type}`
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error("Não foi possível carregar a lista.");
  }
};

export const FollowerList: React.FC<FollowerListProps> = ({
  username,
  type,
}) => {
  const {
    data: list,
    isLoading,
    error,
  } = useQuery<UserPreview[], Error>({
    queryKey: ["followList", username, type],
    queryFn: () => fetchFollowList(username, type),
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24 text-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-24 text-red-500">
        <AlertTriangle className="h-5 w-5 mb-1" />
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-4">
        Nenhum usuário para mostrar.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {list.map((user) => (
        <li key={user.username} className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar_url || undefined}
              alt={`Avatar de ${user.username}`}
            />
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/profile/${user.username}`}
            className="font-semibold hover:underline"
          >
            {user.username}
          </Link>
        </li>
      ))}
    </ul>
  );
};
