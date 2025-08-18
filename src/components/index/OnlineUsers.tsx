"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { OnlineUser, RawOnlineUser } from "@/types/users";
import Link from "next/link";
import { useAuth } from "@/services/auth";

function getRoleColor(role?: string) {
  switch (role?.toLowerCase()) {
    case "visitante":
      return "text-green-500";
    case "partner":
      return "text-yellow-500";
    case "membro":
      return "text-blue-500";
    case "leader":
      return "text-pink-500";
    case "fundador":
      return "text-red-500";
    case "desenvolvedor":
      return "text-yellow-400";
    default:
      return "text-gray-400";
  }
}

export function OnlineUsers() {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const { user: currentUser } = useAuth();
  useEffect(() => {
    async function fetchOnlineUsers() {
      try {
        const res = await fetch(`${API_URL}/user/online`, {
          credentials: "include",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        const onlineUsers: OnlineUser[] = (data as RawOnlineUser[]).map(
          (item) => ({
            name: item.profiles.username,
            avatar_url: item.profiles.avatar_url,
            role: item.profiles.role,
          })
        );

        setUsers(onlineUsers);
      } catch {}
    }

    fetchOnlineUsers();

    const interval = setInterval(fetchOnlineUsers, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [API_URL]);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Usuários Online</span>
          <Badge variant="secondary" className="ml-auto">
            {users.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user, index) => {
            const isCurrentUser =
              currentUser && user.name === currentUser.username;

            const profileUrl = isCurrentUser
              ? "/profile"
              : `/profile/${user.name}`;
            return (
              <div key={index} className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {user.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Link href={profileUrl}>
                  <span
                    className={`text-sm font-medium hover:underline cursor-pointer ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
