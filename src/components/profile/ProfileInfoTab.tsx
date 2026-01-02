import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { UpdateData } from "./UpdateData";
import { formatDate, formatLastLogin } from "@/utils/dateUtils";
import { UserProfile } from "@/schema/user";

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
  return (
    <TabsContent value="perfil" className="mt-4">
      <Card className="border-gray-700 bg-slate-800 text-white">
        <CardHeader>
          <CardTitle>Sobre</CardTitle>
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
            <div className="text-sm text-white flex items-center gap-2 mb-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              Atualizando perfil...
            </div>
          )}
          <div className="flex justify-between py-3">
            <span className="font-semibold">Gênero:</span>
            <span>{profile?.gender || "--"}</span>
          </div>
          <Separator className="bg-gray-600" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">Mensagens:</span>
            <span>{profile?.mensagens_count ?? "--"}</span>
          </div>
          <Separator className="bg-gray-600" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">Data de nascimento:</span>
            <span>{formatDate(profile?.birthdate)}</span>
          </div>
          <Separator className="bg-gray-600" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">Data de inscrição:</span>
            <span>{formatDate(profile?.joined_at)}</span>
          </div>
          <Separator className="bg-gray-600" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">Último login:</span>
            <span>{formatLastLogin(profile?.last_login ?? null)}</span>
          </div>
          <Separator className="bg-gray-600" />
          <div className="flex justify-between py-3">
            <span className="font-semibold">Localização:</span>
            <span>{profile?.location || "--"}</span>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
