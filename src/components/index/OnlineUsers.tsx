"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { OnlineUser, RawOnlineUser } from "@/types/users";
import Link from "next/link";
import { useAuth } from "@/services/auth";
import { getRoleColor } from "@/utils/colors";

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
            username: item.profiles.username,
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
              currentUser && user.username === currentUser.username;
            const profileUrl = isCurrentUser
              ? "/profile"
              : `/profile/${user.username}`;
            return (
              <div key={index} className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {user.username[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Link href={profileUrl}>
                  <span
                    className={`text-sm font-medium hover:underline cursor-pointer ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.username}
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
