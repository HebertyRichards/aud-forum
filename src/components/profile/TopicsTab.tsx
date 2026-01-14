import { useUserTopics } from "@/hooks/useUserTopics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateUtils";
import { UserProfile } from "@/schema/user";

export type StatisticsTabProps = Pick<UserProfile, "username">;
export function TopicsTab({ username }: StatisticsTabProps) {
  const { data: topics, isLoading, error } = useUserTopics(username);

  if (isLoading)
    return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
  if (error)
    return (
      <p className="text-red-500 flex items-center gap-2">
        <AlertTriangle size={16} />
        {error.message}
      </p>
    );

  return (
    <Card className="border-slate-700 bg-slate-800 text-white">
      <CardHeader>
        <CardTitle>Tópicos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics && topics.length > 0 ? (
          <ul className="space-y-4">
            {topics.map((topic) => (
              <li
                key={topic.title}
                className="border-b border-slate-700 pb-3 last:border-b-0"
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
