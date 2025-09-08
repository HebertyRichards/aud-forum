"use client";

import { useQuery } from "@tanstack/react-query";
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
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { RecentPost } from "@/types/post";

const fetchRecentPosts = async (): Promise<RecentPost[]> => {
  try {
    const res = await fetch(`/api/forum/posts/recent`);
    if (!res.ok) {
      throw new Error("Falha na resposta da API");
    }
    return res.json();
  } catch {
    throw new Error("Erro ao mostrar os tópicos recentes.");
  }
};

export function RecentPosts() {
  const [visiblePosts, setVisiblePosts] = useState(4);

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<RecentPost[], Error>({
    queryKey: ["recentPosts"],
    queryFn: fetchRecentPosts,
  });

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp />
            <span>Últimas Publicações</span>
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
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp />
            <span>Últimas Publicações</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col text-red-500 justify-center items-center h-48">
          <AlertTriangle className="h-6 w-6 mb-2" />
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Últimas Publicações</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-700">
          {posts?.slice(0, visiblePosts).map((post) => (
            <div key={post.id} className="p-4 flex items-start space-x-4">
              <Link href={`/profile/${post.author_username}`}>
                <Avatar className="w-10 h-10 mt-1">
                  <AvatarImage src={post.author_avatar || undefined} />
                  <AvatarFallback>{post.author_username?.[0]}</AvatarFallback>
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700 mt-1 dark:text-gray-500">
                  <span>
                    por:{" "}
                    <Link href={`/profile/${post.author_username}`}>
                      <span className="font-medium text-gray-500 dark:text-gray-300 hover:underline cursor-pointer">
                        {" "}
                        {post.author_username}
                      </span>
                    </Link>
                  </span>
                  <span>
                    em:{" "}
                    <Link href={`/topics/${post.category_slug}`}>
                      <span className="font-medium text-gray-500 dark:text-gray-300 hover:underline cursor-pointer">
                        {post.category_name}
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
                            locale: ptBR,
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
              Ver mais publicações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
