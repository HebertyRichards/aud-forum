"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { UpdateData } from "./UpdateData";
import { formatDate, formatLastLogin } from "@/utils/dateUtils";
import { UserProfile } from "@/schema/user";
import { useTranslations } from "next-intl";

type ProfileTabCommonProps = {
  profile: UserProfile | null;
  isOwnProfile: boolean;
  onSuccessUpdate: () => void;
  isUpdating?: boolean;
};

export function ProfileInfoTab({
  profile,
  isOwnProfile,
  isUpdating,
  onSuccessUpdate,
}: ProfileTabCommonProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const tForum = useTranslations("forum");

  return (
    <TabsContent value="perfil" className="mt-4">
      <Card className="dark:border-gray-700 dark:bg-slate-800 border-gray-100 bg-slate-200">
        <CardHeader>
          <CardTitle>{t("info")}</CardTitle>
          {isOwnProfile && profile && (
            <UpdateData
              profile={{
                ...profile,
                avatar_url: profile.avatar_url ?? undefined,
                gender: profile.gender ?? undefined,
                birthdate: profile.birthdate ?? undefined,
                location: profile.location ?? undefined,
                website: profile.website ?? undefined,
                facebook: profile.facebook ?? undefined,
                instagram: profile.instagram ?? undefined,
                discord: profile.discord ?? undefined,
                steam: profile.steam ?? undefined,
                last_login: profile.last_login ?? undefined,
              }}
              onSuccess={onSuccessUpdate}
            />
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isUpdating && (
            <div className="text-sm flex items-center gap-2 mb-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              {tCommon("loading")}
            </div>
          )}
          <div className="flex justify-between py-3">
            <span className="font-semibold">{t("gender")}:</span>
            <span>{profile?.gender || "--"}</span>
          </div>
          <Separator className="dark:bg-gray-700 bg-gray-100" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">{tForum("messages")}:</span>
            <span>{profile?.mensagens_count ?? "--"}</span>
          </div>
          <Separator className="dark:bg-gray-700 bg-gray-100" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">{t("birthdate")}:</span>
            <span>{formatDate(profile?.birthdate)}</span>
          </div>
          <Separator className="dark:bg-gray-700 bg-gray-100" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">{t("dateOfSubscribed")}:</span>
            <span>{formatDate(profile?.joined_at)}</span>
          </div>
          <Separator className="dark:bg-gray-700 bg-gray-100" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">{t("lastVisit")}:</span>
            <span>{formatLastLogin(profile?.last_login ?? null)}</span>
          </div>
          <Separator className="dark:bg-gray-700 bg-gray-100" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">{t("location")}:</span>
            <span>{profile?.location || "--"}</span>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
