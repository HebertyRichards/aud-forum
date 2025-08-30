"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, AlertTriangle } from "lucide-react";
import { UserPreview, FollowListModalProps } from "@/types/profile";

export function FollowListModal({
  username,
  listType,
  onClose,
}: FollowListModalProps) {
  const [users, setUsers] = useState<UserPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/follow/${username}/${listType}`);
        if (!res.ok) {
          throw new Error("Falha ao carregar a lista de usuários.");
        }
        const data: UserPreview[] = await res.json();
        setUsers(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [username, listType, API_URL]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md border-gray-700 bg-white dark:bg-gray-800 relative animate-in fade-in-0 zoom-in-95">
        <CardHeader className="text-center">
          <CardTitle className="capitalize">
            {listType === "followers" ? "Seguidores" : "Seguindo"}
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-opacity"
          >
            <X size={24} />
          </button>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-red-500">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <p>{error}</p>
            </div>
          ) : users.length > 0 ? (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.username}>
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage
                        src={user.avatar_url || undefined}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{user.username}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 py-4">
              Nenhum usuário para mostrar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
