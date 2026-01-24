import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Globe, Facebook, Instagram } from "lucide-react";
import { FaDiscord, FaSteam } from "react-icons/fa";
import { UpdateContacts } from "./UpdateContacts";
import { formatUrl } from "@/utils/urlUtils";
import { UserProfile } from "@/schema/user";
import { useTranslations } from "next-intl";

type ProfileTabCommonProps = {
  profile: UserProfile | null;
  isOwnProfile: boolean;
  onSuccessUpdate: () => void;
};

export function ProfileContactTab({
  profile,
  isOwnProfile,
  onSuccessUpdate,
}: ProfileTabCommonProps) {
  const t = useTranslations("profile");

  return (
    <TabsContent value="contato" className="mt-4">
      <Card className="dark:border-slate-700 dark:bg-slate-800 border-slate-100 bg-slate-200">
        <CardHeader>
          <CardTitle>{t("contacts")}</CardTitle>
          {isOwnProfile && profile && (
            <UpdateContacts
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
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">{t("website")}:</span>
            {profile?.website ? (
              <a
                href={formatUrl(profile.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
              >
                <Globe size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
          <Separator className="dark:bg-slate-700 bg-slate-100" />
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">{t("facebook")}:</span>
            {profile?.facebook ? (
              <a
                href={formatUrl(profile.facebook)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
              >
                <Facebook size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
          <Separator className="dark:bg-slate-700 bg-slate-100" />
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">{t("instagram")}:</span>
            {profile?.instagram ? (
              <a
                href={formatUrl(profile.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500"
              >
                <Instagram size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
          <Separator className="dark:bg-slate-700 bg-slate-100" />
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">{t("discord")}:</span>
            {profile?.discord ? (
              <a
                href={formatUrl(profile.discord)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-500"
              >
                <FaDiscord size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
          <Separator className="dark:bg-slate-700 bg-slate-100" />
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">{t("steam")}:</span>
            {profile?.steam ? (
              <a
                href={formatUrl(profile.steam)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700"
              >
                <FaSteam size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
