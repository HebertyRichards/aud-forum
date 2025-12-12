"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { OnlineUser, RawOnlineUser } from "@/types/users";
import Link from "next/link";
import { useAuth } from "@/services/auth";
import { getRoleColor } from "@/utils/colors";
import { useOnlineUsers } from "@/services/online";

export function OnlineUsers() {
  const { user: currentUser } = useAuth();
  
  const { onlineUsers } = useOnlineUsers();

  const users: OnlineUser[] = onlineUsers
    ? (onlineUsers as RawOnlineUser[]).map((item) => item.profiles)
    : [];

  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Usuários Online</span>
          <Badge className="ml-auto bg-slate-700">{users.length}</Badge>
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
                    <AvatarImage
                      src={user.avatar_url}
                      alt={`avatar de ${user.username}`}
                    />
                  ) : (
                    <AvatarFallback className="text-xs bg-slate-600">
                      {user.username[0]}
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
          })}
        </div>
      </CardContent>
    </Card>
  );
}
