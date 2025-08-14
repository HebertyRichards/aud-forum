"use client";

import { ForumCategoryList } from "@/components/ForumCategoryList";
import { RecentPosts } from "@/components/RecentPosts";
import { ForumStats } from "@/components/ForumStats";
import { OnlineUsers } from "@/components/OnlineUsers";
import {
  forumData as mockForumData,
  recentPosts,
  forumStats,
} from "@/utils/forum-data";
import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth";
import { Category } from "@/types/post";

export default function ForumPage() {
  const auth = useAuth();
  const user = auth?.user;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [forumData, setForumData] = useState<Category[]>([]);
  const isAuthorized = true;

  useEffect(() => {
    const dataToLoad = isAuthorized
      ? mockForumData
      : mockForumData.filter((category) => category.id !== "area-oculta");

    setForumData(dataToLoad);
  }, [isAuthorized]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const ping = async () => {
      try {
        await fetch(`${API_URL}/user/ping`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error: unknown) {}
    };

    ping();

    const interval = setInterval(ping, 60 * 1000);

    return () => clearInterval(interval);
  }, [user, API_URL]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <main className="lg:col-span-3 space-y-8">
          <RecentPosts posts={recentPosts} />
          <ForumCategoryList categories={forumData} />
        </main>

        <aside className="space-y-6">
          <ForumStats stats={forumStats} />
          <OnlineUsers />
        </aside>
      </div>
    </div>
  );
}
