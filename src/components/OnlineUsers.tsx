"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { OnlineUser, RawOnlineUser } from "@/types/users";
import Link from "next/link";

export function OnlineUsers() {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
            avatar: "/placeholder.svg",
            status: "online",
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
          {users.map((user, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="relative">
                <Avatar className="w-6 h-6">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {user.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
              </div>
              <Link href={`/profile/${user.name}`}>
                <span className="text-sm font-medium hover:underline cursor-pointer">
                  {user.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
