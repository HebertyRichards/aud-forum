"use client";

import { useUserStats } from "@/hooks/useUserStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { Separator } from "../ui/separator";
import { formatPostTimestamp } from "@/utils/dateUtils";
import { UserProfile } from "@/schema/user";
import { useTranslations } from "next-intl";

export type StatisticsTabProps = Pick<UserProfile, "username">;

export function StatisticsTab({ username }: StatisticsTabProps) {
  const { data: stats, isLoading, error } = useUserStats(username);
  const t = useTranslations("profile");

  if (error) {
    return (
      <p className="text-red-500 flex items-center gap-2">
        <AlertTriangle size={16} />
        {error.message}
      </p>
    );
  }

  if (isLoading)
    return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
  if (!stats) return null;

  return (
    <Card className="dark:border-slate-700 dark:bg-slate-800 border-slate-100 bg-slate-200">
      <CardHeader>
        <CardTitle>{t("statistics")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between py-2">
          <span className="font-semibold">{t("totalTopics")}:</span>
          <span>
            {stats.topicsCount} ({stats.topicsPerDay}/day)
          </span>
        </div>
        <Separator className="dark:bg-slate-600 bg-slate-200" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">{t("totalComments")}:</span>
          <span>
            {stats.messagesCount} ({stats.messagesPerDay}/day)
          </span>
        </div>
        <Separator className="dark:bg-slate-600 bg-slate-200" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">{t("lastVisit")}:</span>
          <span>{formatPostTimestamp(stats.lastPostDate ?? null)}</span>
        </div>
        <Separator className="dark:bg-slate-600 bg-slate-200" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">{t("percentagePosts")}:</span>
          <span>{stats.messagesPercentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
