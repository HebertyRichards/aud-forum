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
import { Category } from "@/types/post";

export default function ForumPage() {
  const [forumData, setForumData] = useState<Category[]>([]);
  const isAuthorized = true;

  useEffect(() => {
    const dataToLoad = isAuthorized
      ? mockForumData
      : mockForumData.filter((category) => category.id !== "area-oculta");

    setForumData(dataToLoad);
  }, [isAuthorized]);

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
