import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Pin, Star, MessageSquare, Eye, Clock } from "lucide-react";
import { RecentPostsProps } from "@/types/post";

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Últimas Publicações</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {posts.map((post) => (
            <div key={post.id} className="p-4 flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium truncate hover:underline cursor-pointer">
                    {post.title}
                  </h4>
                  {post.isPinned && (
                    <Pin className="w-4 h-4 text-blue-500 shrink-0" />
                  )}
                  {post.isHot && (
                    <Star className="w-4 h-4 text-orange-500 shrink-0" />
                  )}
                </div>
                <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    por <span className="font-medium">{post.author}</span>
                  </span>
                  <span>
                    em <span className="font-medium">{post.category}</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
