"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getRoleColor } from "@/utils/colors";
import { useFollowList } from "@/hooks/useFollowList";
import { useTranslations } from "next-intl";

interface FollowerListProps {
  username: string;
  type: "followers" | "following";
}

export const FollowerList = ({ username, type }: FollowerListProps) => {
  const { data: list, isLoading, error } = useFollowList(username, type);
  const t = useTranslations("profile");
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
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <p className="text-center text-sm dark:text-gray-400 text-gray-700 py-4">
        {t("noUsersToShow")}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {list.map((user) => (
        <li key={user.username} className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar_url || undefined}
              alt={`Avatar de ${user.username}`}
            />
            <AvatarFallback className="dark:bg-slate-600 bg-slate-200">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/profile/${user.username}`}
            className="group flex flex-col"
          >
            <span
              className={`font-semibold hover:underline ${getRoleColor(
                user.role
              )}`}
            >
              {user.username}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
