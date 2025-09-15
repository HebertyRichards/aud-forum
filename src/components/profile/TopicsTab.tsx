import { useUserTopics } from "@/hooks/useUserTopics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateUtils";
import type { UserProfile } from "@/types/profile";

export type StatisticsTabProps = Pick<UserProfile, 'username'>;
export function TopicsTab({ username }: StatisticsTabProps) {
  const { topics, isLoading, error } = useUserTopics(username);

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-4" />;
  if (error)
    return (
      <p className="text-red-500 flex items-center gap-2">
        <AlertTriangle size={16} />
        {error}
      </p>
    );

  return (
    <Card className="border-gray-700 bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle>Tópicos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics.length > 0 ? (
          <ul className="space-y-4">
            {topics.map((topic) => (
              <li
                key={topic.title}
                className="border-b border-gray-700 pb-3 last:border-b-0"
              >
                <Link
                  href={`/topics/${topic.category}/${topic.slug}`}
                  className="hover:text-blue-500"
                >
                  <h3 className="font-semibold">{topic.title}</h3>
                </Link>
                <div className="text-xs text-gray-400 flex justify-between items-center mt-1">
                  <span>{formatDate(topic.created_in)}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} />{" "}
                    {topic.comentarios[0]?.count ?? 0}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Este usuário ainda não criou nenhum tópico.</p>
        )}
      </CardContent>
    </Card>
  );
}
