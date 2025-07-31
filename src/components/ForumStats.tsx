import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ForumStatsProps {
  stats: {
    activeMembers: number;
    totalPosts: string;
    totalTopics: number;
    newestMember: string;
  };
}

export function ForumStats({ stats }: ForumStatsProps) {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Membros Ativos</span>
          <span className="font-semibold">{stats.activeMembers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Posts Totais</span>
          <span className="font-semibold">{stats.totalPosts}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tópicos Totais</span>
          <span className="font-semibold">{stats.totalTopics}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Novo Membro</span>
          <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
            {stats.newestMember}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
