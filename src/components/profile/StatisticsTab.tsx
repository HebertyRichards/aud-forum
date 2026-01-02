import { useUserStats } from "@/hooks/useUserStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { Separator } from "../ui/separator";
import { formatPostTimestamp } from "@/utils/dateUtils";
import { UserProfile } from "@/schema/user";

export type StatisticsTabProps = Pick<UserProfile, "username">;

export function StatisticsTab({ username }: StatisticsTabProps) {
  const { stats, isLoading, error } = useUserStats(username);

  if (isLoading)
    return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
  if (error)
    return (
      <p className="text-red-500 flex items-center gap-2">
        <AlertTriangle size={16} />
        {error}
      </p>
    );
  if (!stats) return null;

  return (
    <Card className="border-slate-700 bg-slate-800 text-white">
      <CardHeader>
        <CardTitle>Estatísticas Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between py-2">
          <span className="font-semibold">Total de Tópicos:</span>
          <span>
            {stats.topicsCount} ({stats.topicsPerDay} por dia)
          </span>
        </div>
        <Separator className="bg-slate-600" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">Total de Mensagens:</span>
          <span>
            {stats.messagesCount} ({stats.messagesPerDay} por dia)
          </span>
        </div>
        <Separator className="bg-slate-600" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">Última postagem:</span>
          <span>{formatPostTimestamp(stats.lastPostDate ?? null)}</span>
        </div>
        <Separator className="bg-slate-600" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">% de posts do fórum:</span>
          <span>{stats.messagesPercentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
