// components/profile/FollowListModal.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";

interface UserItem {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface FollowListModalProps {
  userId: string;
  listType: "followers" | "following";
  onClose: () => void;
}

export function FollowListModal({
  userId,
  listType,
  onClose,
}: FollowListModalProps) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/profile/${userId}/${listType}`);
        if (!res.ok) throw new Error("Falha ao carregar a lista.");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId, listType, API_URL]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <Card className="w-full max-w-md border-gray-700 bg-white dark:bg-gray-800 relative">
        <CardHeader className="text-center">
          <CardTitle className="capitalize">
            {listType === "followers" ? "Seguidores" : "Seguindo"}
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : users.length > 0 ? (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.id}>
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
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
