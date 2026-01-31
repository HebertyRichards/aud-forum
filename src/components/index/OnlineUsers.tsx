"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { OnlineUser, RawOnlineUser } from "@/schema/forum";
import Link from "next/link";
import { useAuth } from "@/providers/auth";
import { getRoleColor } from "@/utils/colors";
import { useOnlineUsers } from "@/providers/online";
import { useTranslations } from "next-intl";

export function OnlineUsers() {
  const auth = useAuth();
  const currentUser = auth?.user || null;
const t = useTranslations("Index");
  const { onlineUsers, isConnected } = useOnlineUsers();

  const users: OnlineUser[] = Array.isArray(onlineUsers)
    ? onlineUsers.map((item: RawOnlineUser) => item.profiles)
    : [];

  const userCount = users.length;

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>{t("onlineUsers")}</span>
          <Badge className="ml-auto dark:bg-slate-700 dark:text-white bg-slate-100 text-slate-800">{userCount}</Badge>
        </CardTitle>  
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!isConnected ? (
            <p className="text-sm dark:text-slate-300 text-slate-600 text-center py-2 animate-pulse">
              {t("loading")}
            </p>
          ) : users.length === 0 ? (
            <p className="text-sm dark:text-slate-300 text-slate-600 text-center py-2">
              {t("noOnlineUsers")}
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
                      <AvatarFallback className="text-xs dark:bg-slate-600 bg-slate-100 select-none">
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
