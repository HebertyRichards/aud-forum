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

export default function ForumPage() {
  // futura lógica para certos cargos visualizarem a área oculta
  const isAuthorized = true;

  const visibleForumData = isAuthorized
    ? forumData
    : forumData.filter((category) => category.id !== "area-oculta");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <main className="lg:col-span-3 space-y-8">
          <ForumCategoryList categories={visibleForumData} />
          <RecentPosts posts={recentPosts} />
        </main>

        <aside className="space-y-6">
          <ForumStats stats={forumStats} />
          <OnlineUsers users={onlineUsers} />
        </aside>
      </div>
    </div>
  );
}
