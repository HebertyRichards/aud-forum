"use client";

import { useForumData } from "@/hooks/useForumData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  MessageSquare,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import Link from "next/link";
import { RecentPost } from "@/schema/forum";
import { getRoleColor } from "@/utils/colors";
import { useTranslations, useLocale } from "next-intl";

const dateLocales: Record<string, any> = {
  pt: ptBR,
  en: enUS,
  es: es,
};

export function RecentPosts() {
  const [visiblePosts, setVisiblePosts] = useState(4);
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = dateLocales[locale] || ptBR;

  const { data, isLoading, error } = useForumData();

  if (isLoading) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp />
            <span>{t("Index.recentPosts")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp />
            <span>{t("Index.recentPosts")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col text-red-500 justify-center items-center h-48">
          <AlertTriangle className="h-6 w-6 mb-2" />
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }
  
  const posts: RecentPost[] | undefined = data?.recentPosts;
  
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-100">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>{t("Index.recentPosts")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-700">
          {posts?.slice(0, visiblePosts).map((post: RecentPost) => (
            <div key={post.id} className="p-4 flex items-start space-x-4">
              <Link href={`/profile/${post.author_username}`}>
                <Avatar className="w-10 h-10 mt-1">
                  <AvatarImage
                    src={post.author_avatar || undefined}
                    alt={`avatar de ${post.author_username}`}
                  />
                  <AvatarFallback className="dark:bg-slate-600 bg-slate-100">
                    {post.author_username?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={
                    post.category_slug && post.topic_slug
                      ? `/topics/${post.category_slug}/${post.topic_slug}`
                      : "#"
                  }
                  passHref
                >
                  <h4 className="font-medium truncate hover:underline cursor-pointer">
                    {post.title}
                  </h4>
                </Link>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <span>
                    {t("Index.by")}:{" "}
                    <Link href={`/profile/${post.author_username}`}>
                      <span
                        className={`truncate font-semibold hover:underline cursor-pointer ${getRoleColor(
                          post.role
                        )}`}
                      >
                        {" "}
                        {post.author_username}
                      </span>
                    </Link>
                  </span>
                  <span>
                    {t("Index.in")}:{" "}
                    <Link href={`/topics/${post.category_slug}`}>
                      <span className="font-medium text-gray-500 dark:text-gray-300 hover:underline cursor-pointer">
                        {t(`categories.${post.category_slug}.name`)}
                      </span>
                    </Link>
                  </span>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comment_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {post.created_in
                        ? formatDistanceToNow(new Date(post.created_in), {
                            addSuffix: true,
                            locale: dateLocale,
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {posts && posts.length > 4 && visiblePosts < 10 && (
          <div className="p-4 text-center">
            <Button
              onClick={() => setVisiblePosts(10)}
              variant="outline"
              className="w-full"
            >
              {t("Index.viewMostPosts")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
