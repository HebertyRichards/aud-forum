import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { UpdateAvatar } from "./UpdateAvatar";
import { getRoleColor } from "@/utils/colors";
import { UserProfileLayoutProps } from "@/types/profile";

type UserProfileSidebarProps = Pick<
  UserProfileLayoutProps,
  "profile" | "isOwnProfile" | "followState"
> & {
  onOpenModal: (listType: "followers" | "following") => void;
};

export function UserProfileSidebar({
  profile,
  isOwnProfile,
  followState,
  onOpenModal,
}: UserProfileSidebarProps) {
  const { stats, isFollowing, isFollowLoading, onFollow, onUnfollow } =
    followState;

  return (
    <aside className="space-y-6">
      <Card className="border-gray-700 text-center bg-white dark:bg-gray-800">
        <CardContent className="p-6 flex flex-col items-center">
          <h2
            className={`${getRoleColor(
              profile?.role
            )} text-xl font-bold hover:underline cursor-pointer mb-4`}
          >
            {profile?.username}
          </h2>
          <div className="relative group mb-4">
            <Avatar className="w-24 h-24 border-2 border-gray-500">
              <AvatarImage
                src={profile?.avatar_url || undefined}
                alt={profile?.username}
                key={profile?.avatar_url}
              />
              <AvatarFallback>{profile?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <UpdateAvatar
                onSuccess={() => {}}
                currentAvatarUrl={profile?.avatar_url}
              />
            )}
          </div>
          {!isOwnProfile && (
            <Button
              onClick={isFollowing ? onUnfollow : onFollow}
              disabled={isFollowLoading}
              variant={isFollowing ? "outline" : "default"}
              className="w-full mb-4"
            >
              {isFollowLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isFollowing ? (
                <UserCheck className="mr-2 h-4 w-4" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isFollowing ? "Seguindo" : "Seguir"}
            </Button>
          )}
          <div className="text-sm">
            <span className="font-semibold">Rank: </span>
            <span className={`${getRoleColor(profile?.role)} font-bold`}>
              {profile?.role || "--"}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg text-center">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around text-center">
          <button
            onClick={() => onOpenModal("followers")}
            className="p-2 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700"
          >
            <p className="font-bold text-xl">{stats?.followers_count ?? 0}</p>
            <p className="text-sm text-gray-400">Seguidores</p>
          </button>
          <button
            onClick={() => onOpenModal("following")}
            className="p-2 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700"
          >
            <p className="font-bold text-xl">{stats?.following_count ?? 0}</p>
            <p className="text-sm text-gray-400">Seguindo</p>
          </button>
        </CardContent>
      </Card>
    </aside>
  );
}
