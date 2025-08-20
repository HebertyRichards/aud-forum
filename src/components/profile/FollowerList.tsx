import React, { useState, useEffect } from "react";
import { UserPreview, FollowerListProps } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const FollowerList: React.FC<FollowerListProps> = ({ userId, type }) => {
  const [list, setList] = useState<UserPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/profile/${userId}/${type}`);
        if (!response.ok) {
          throw new Error("Não foi possível carregar a lista.");
        }
        const data = await response.json();
        setList(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchList();
    }
  }, [userId, type, API_URL]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-24 text-red-500">
        <AlertTriangle className="h-5 w-5 mb-1" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-4">
        Nenhum usuário para mostrar.
      </p>
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
