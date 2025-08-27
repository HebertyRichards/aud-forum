import { ForumCategoryList } from "@/components/index/ForumCategoryList";
import { RecentPosts } from "@/components/index/RecentPosts";
import { ForumStats } from "@/components/index/ForumStats";
import { OnlineUsers } from "@/components/index/OnlineUsers";
import { recentPosts, forumStats } from "@/utils/forum-data";

export default function ForumPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <main className="lg:col-span-3 space-y-8">
          <RecentPosts posts={recentPosts} />
          <ForumCategoryList />
        </main>
        <aside className="space-y-6">
          <ForumStats stats={forumStats} />
          <OnlineUsers />
        </aside>
      </div>
    </div>
  );
}
