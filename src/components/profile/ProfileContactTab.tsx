import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Globe, Facebook, Instagram } from "lucide-react";
import { FaDiscord, FaSteam } from "react-icons/fa";
import { UpdateContacts } from "./UpdateContacts";
import { formatUrl } from "@/utils/urlUtils";
import { UserProfile } from "@/schema/user";

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
  return (
    <TabsContent value="contato" className="mt-4">
      <Card className="border-slate-700 bg-slate-800 text-white">
        <CardHeader>
          <CardTitle>Contatos</CardTitle>
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
            <span className="font-semibold">Website:</span>
            {profile?.website ? (
              <a
                href={formatUrl(profile.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-blue-500"
              >
                <Globe size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
          <Separator className="bg-slate-600" />
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">Facebook:</span>
            {profile?.facebook ? (
              <a
                href={formatUrl(profile.facebook)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-blue-500"
              >
                <Facebook size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
          <Separator className="bg-slate-600" />
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">Instagram:</span>
            {profile?.instagram ? (
              <a
                href={formatUrl(profile.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-pink-500"
              >
                <Instagram size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
          <Separator className="bg-slate-600" />
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">Discord:</span>
            {profile?.discord ? (
              <a
                href={formatUrl(profile.discord)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-indigo-500"
              >
                <FaDiscord size={20} />
              </a>
            ) : (
              <span>--</span>
            )}
          </div>
          <Separator className="bg-slate-600" />
          <div className="flex justify-between py-3 items-center">
            <span className="font-semibold">Steam:</span>
            {profile?.steam ? (
              <a
                href={formatUrl(profile.steam)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-blue-700"
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
