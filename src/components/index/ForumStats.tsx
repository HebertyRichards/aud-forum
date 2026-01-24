"use client";

import { useForumData } from "@/hooks/useForumData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRoleColor } from "@/utils/colors";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function ForumStats() {
  const { data, isLoading } = useForumData();

  const t = useTranslations("Index");

  if (isLoading) {
    return (
      <Card className="dark:bg-slate-800 bg-slate-200 dark:border-slate-700 border-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">{t("stats")}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  const lastUser = data?.lastUser;

  return (
    <Card className="dark:bg-slate-800 bg-slate-200 dark:border-slate-700 border-slate-100">
      <CardHeader>
        <CardTitle className="text-lg">{t("stats")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm dark:text-slate-300 text-slate-700">{t("members")}</span>
          <span className="font-semibold">
            {data?.stats?.activeMembers ?? "..."}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm dark:text-slate-300 text-slate-700">{t("totalPosts")}</span>
          <span className="font-semibold">
            {data?.stats?.totalPosts ?? "..."}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm dark:text-slate-300 text-slate-700">{t("totalTopics")}</span>
          <span className="font-semibold">
            {data?.stats?.totalTopics ?? "..."}
          </span>
        </div>
        <Separator className="bg-slate-600" />
        <div className="flex justify-between items-center">
          <span className="text-sm dark:text-slate-300 text-slate-700">{t("lastUser")}</span>
          {lastUser ? (
            <Link href={`/profile/${lastUser.username}`}>
              <span
                className={`truncate font-semibold hover:underline cursor-pointer ${getRoleColor(
                  lastUser.role
                )}`}
              >
                {lastUser.username}
              </span>
            </Link>
          ) : (
            <span className="font-semibold">{t("noUsers")}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
