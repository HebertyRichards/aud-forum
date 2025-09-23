import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { UpdateData } from "./UpdateData";
import { formatDate, formatLastLogin } from "@/utils/dateUtils";
import type { ProfileInfoTabProps } from "@/types/profile";

export function ProfileInfoTab({
  profile,
  isOwnProfile,
  isUpdating,
  onSuccessUpdate,
}: ProfileInfoTabProps) {
  return (
    <TabsContent value="perfil" className="mt-4">
      <Card className="border-gray-700 bg-slate-800 text-white">
        <CardHeader>
          <CardTitle>Sobre</CardTitle>
          {isOwnProfile && profile && (
            <UpdateData profile={profile} onSuccess={onSuccessUpdate} />
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
