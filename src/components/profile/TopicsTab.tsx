"use client";

import { useUserTopics } from "@/hooks/useUserTopics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateUtils";
import { UserProfile } from "@/schema/user";
import { useTranslations } from "next-intl";

export type StatisticsTabProps = Pick<UserProfile, "username">;

export function TopicsTab({ username }: StatisticsTabProps) {
  const { data: topics, isLoading, error } = useUserTopics(username);
  const t = useTranslations("profile");

  if (isLoading)
    return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
  if (error)
    return (
      <p className="text-red-500 flex items-center gap-2">
        <AlertTriangle size={16} />
        {error.message}
      </p>
    );

  return (
    <Card className="dark:border-slate-700 dark:bg-slate-800 border-slate-100 bg-slate-200">
      <CardHeader>
        <CardTitle>{t("topics")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics && topics.length > 0 ? (
          <ul className="space-y-4">
            {topics.map((topic) => (
              <li
                key={topic.title}
                className="dark:border-slate-700 border-slate-100 pb-3 last:border-b-0"
              >
                <Link
                  href={`/topics/${topic.category}/${topic.slug}`}
                  className="hover:text-blue-500"
                >
                  <h3 className="font-semibold">{topic.title}</h3>
                </Link>
                <div className="text-xs text-gray-400 dark:text-gray-700 flex justify-between items-center mt-1">
                  <span>{formatDate(topic.created_in)}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} />{" "}
                    {topic.comentarios[0]?.count ?? 0}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("noTopics")}</p>
        )}
      </CardContent>
    </Card>
  );
}
