import { useUserStats } from "@/hooks/useUserStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { Separator } from "../ui/separator";
import { formatPostTimestamp } from "@/utils/dateUtils";
import type { UserProfile } from "@/types/profile";

export type StatisticsTabProps = Pick<UserProfile, "username">;

export function StatisticsTab({ username }: StatisticsTabProps) {
  const { stats, isLoading, error } = useUserStats(username);

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-4" />;
  if (error)
    return (
      <p className="text-red-500 flex items-center gap-2">
        <AlertTriangle size={16} />
        {error}
      </p>
    );
  if (!stats) return null;

  return (
    <Card className="border-gray-700 bg-white dark:bg-gray-800">
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
        <Separator className="bg-gray-600" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">Total de Mensagens:</span>
          <span>
            {stats.messagesCount} ({stats.messagesPerDay} por dia)
          </span>
        </div>
        <Separator className="bg-gray-600" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">Última postagem:</span>
          <span>{formatPostTimestamp(stats.lastPostDate)}</span>
        </div>
        <Separator className="bg-gray-600" />
        <div className="flex justify-between py-2">
          <span className="font-semibold">% de posts do fórum:</span>
          <span>{stats.messagesPercentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
