import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { UpdateAvatar } from "./UpdateAvatar";
import { getRoleColor } from "@/utils/colors";
import { UserProfile } from "@/schema/user";
import { FollowState } from "@/schema/user";
import { useTranslations } from "next-intl";

interface UserProfileLayoutProps {
  profile?: UserProfile | null;
  isLoading: boolean;
  isUpdating?: boolean;
  error?: string | null;
  isOwnProfile?: boolean;
  onSuccessUpdate?: () => void;
  followState?: FollowState;
  onOpenModal?: (listType: "followers" | "following") => void;
}

export function UserProfileSidebar({
  profile,
  isOwnProfile,
  followState,
  onOpenModal,
}: UserProfileLayoutProps) {
  const t = useTranslations("profile");
  const { stats, isFollowing, isFollowLoading, onFollow, onUnfollow } =
    followState || {};

  return (
    <aside className="space-y-6">
      <Card className="border-gray-700 text-center bg-slate-800 text-white">
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
                alt={`Avatar de ${profile?.username}`}
                key={profile?.avatar_url}
              />
              <AvatarFallback className="bg-slate-600">
                {profile?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <UpdateAvatar
                currentAvatarUrl={profile?.avatar_url}
              />
            )}
          </div>
          {!isOwnProfile && (
            <Button
              onClick={isFollowing ? onUnfollow : onFollow}
              disabled={isFollowLoading}
              className={`w-full mb-4 text-white transition-colors ${
                isFollowing
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isFollowLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              ) : isFollowing ? (
                <UserCheck className="mr-2 h-4 w-4" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isFollowing ? t("unfollow") : t("follow")}
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
      <Card className="border-gray-700 bg-slate-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-center">{t("statistics")}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around text-center">
          <button
            onClick={() => onOpenModal?.("followers")}
            className="p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-700 cursor-pointer"
          >
            <p className="font-bold text-xl">{stats?.followers_count ?? 0}</p>
            <p className="text-sm text-gray-400">{t("followers")}</p>
          </button>
          <button
            onClick={() => onOpenModal?.("following")}
            className="p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-700 cursor-pointer"
          >
            <p className="font-bold text-xl">{stats?.following_count ?? 0}</p>
            <p className="text-sm text-gray-400">{t("following")}</p>
          </button>
        </CardContent>
      </Card>
    </aside>
  );
}
