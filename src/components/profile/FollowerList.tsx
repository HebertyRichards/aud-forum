import React, { useState, useEffect } from "react";
import { FollowerInfo } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface FollowerListProps {
  userId: string;
  type: "followers" | "following";
}

export const FollowerList: React.FC<FollowerListProps> = ({ userId, type }) => {
  const [list, setList] = useState<FollowerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/profiles/${userId}/${type}`);
        const data = await response.json();
        setList(data);
      } catch (error: unknown) {
        throw new Error(
          `Erro ao carregar a lista de ${type}: ${
            error instanceof Error ? error.message : "Erro desconhecido"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchList();
    }
  }, [userId, type]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <p className="text-sm text-gray-400">Nenhum usuário para mostrar.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {list.map((user) => (
        <li key={user.id} className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar_url || undefined}
              alt={user.username}
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
