"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { OnlineUser, RawOnlineUser } from "@/schema/forum";
import Link from "next/link";
import { useAuth } from "@/services/auth";
import { getRoleColor } from "@/utils/colors";
import { useOnlineUsers } from "@/services/online";

export function OnlineUsers() {
  const auth = useAuth();
  const currentUser = auth?.user || null;

  const { onlineUsers, isConnected } = useOnlineUsers();

  const users: OnlineUser[] = Array.isArray(onlineUsers)
    ? onlineUsers.map((item: RawOnlineUser) => item.profiles)
    : [];

  const userCount = users.length;

  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Usuários Online</span>
          <Badge className="ml-auto bg-slate-700">{userCount}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!isConnected ? (
            <p className="text-sm text-slate-400 text-center py-2 animate-pulse">
              Carregando...
            </p>
          ) : users.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-2">
              Nenhum usuário online no momento.
            </p>
          ) : (
            users.map((user) => {
              const isCurrentUser =
                currentUser && user.username === currentUser.username;
              const profileUrl = isCurrentUser
                ? "/profile"
                : `/profile/${user.username}`;
              const hasValidAvatar =
                user.avatar_url && !user.avatar_url.includes("/profile/");

              return (
                <div
                  key={user.username}
                  className="flex items-center space-x-2"
                >
                  <Avatar className="w-6 h-6">
                    {hasValidAvatar ? (
                      <AvatarImage
                        src={user.avatar_url!}
                        alt={`avatar de ${user.username}`}
                      />
                    ) : (
                      <AvatarFallback className="text-xs bg-slate-600 select-none">
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Link href={profileUrl}>
                    <span
                      className={`truncate text-sm font-semibold hover:underline cursor-pointer ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.username}
                    </span>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
