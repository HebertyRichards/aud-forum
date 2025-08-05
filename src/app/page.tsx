"use client";

import { ForumCategoryList } from "@/components/ForumCategoryList";
import { RecentPosts } from "@/components/RecentPosts";
import { ForumStats } from "@/components/ForumStats";
import { OnlineUsers } from "@/components/OnlineUsers";
import {
  forumData,
  recentPosts,
  onlineUsers,
  forumStats,
} from "@/utils/forum-data";
import { useEffect } from "react";
import { useAuth } from "@/services/auth";

export default function ForumPage() {
  const auth = useAuth();
  const user = auth?.user;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // futura lógica para certos cargos visualizarem a área oculta
  const isAuthorized = true;

  const visibleForumData = isAuthorized
    ? forumData
    : forumData.filter((category) => category.id !== "area-oculta");

  useEffect(() => {
    if (!user) {
      return;
    }

    async function ping() {
      try {
        await fetch(`${API_URL}/user/ping`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Erro ao enviar ping:", error);
      }
    }

    ping();

    const interval = setInterval(ping, 60 * 1000);

    return () => clearInterval(interval);
  }, [user, API_URL]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <main className="lg:col-span-3 space-y-8">
          <ForumCategoryList categories={visibleForumData} />
          <RecentPosts posts={recentPosts} />
        </main>

        <aside className="space-y-6">
          <ForumStats stats={forumStats} />
          <OnlineUsers />
        </aside>
      </div>
    </div>
  );
}
