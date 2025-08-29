"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/NoTopic";
import { CreateTopicView } from "@/components/CreateTopicView";
import { PlusCircle, ArrowLeft, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPostTimestamp } from "@/utils/dateUtils";
import { useAuth } from "@/services/auth";
import { getTopicsByCategory } from "@/services/topic";
import { TopicSummary } from "@/types/post";

export default function CategoryTopicPage() {
  const params = useParams();
  const { user } = useAuth();
  const category = (params.categories as string) || "";
  const [view, setView] = useState<"list" | "create">("list");
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryTitles: { [key: string]: string } = {
    downloads: "Downloads",
    manuals: "Manuais",
    "general-discussions": "Discussões Gerais",
    members: "Área dos Membros",
    subscribe: "Inscrições",
    updates: "Atualizações",
  };
  useEffect(() => {
    if (view !== "list" || !category) {
      setIsLoading(false);
      return;
    }

    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const data = await getTopicsByCategory(category);
        setTopics(data);
      } catch {
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [category, view]);

  const renderMainContent = () => {
    if (isLoading) {
      return <div className="text-center p-10">Carregando tópicos...</div>;
    }

    if (view === "create") {
      return <CreateTopicView category={category} />;
    }

    if (topics.length === 0) {
      return <EmptyState onNewTopicClick={() => setView("create")} />;
    }

    return (
      <div className="space-y-4">
        {topics.map((topic) => (
          <Link
            href={`/topics/${category}/${topic.slug}`}
            key={topic.id}
            className="block"
          >
            <Card className="p-4 border border-gray-700 bg-white hover:border-blue-500 transition-colors duration-300 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={topic.profiles.avatar_url || undefined} />
                    <AvatarFallback>
                      {topic.profiles.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{topic.title}</h3>
                    <p className="text-xs text-gray-700 dark:text-gray-500">
                      por {topic.profiles.username} •{" "}
                      {formatPostTimestamp(topic.created_in)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-500">
                  <MessageSquare className="h-4 w-4" />
                  <span>{topic.comentarios[0]?.count ?? 0}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  const pageTitle = categoryTitles[category] || "Tópicos";
  return (
    <div className="min-h-screen font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/topics">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Fóruns
            </Link>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <div className="flex gap-2">
            {view === "create" ? (
              <Button variant="outline" onClick={() => setView("list")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            ) : (
              user && (
                <Button
                  onClick={() => setView("create")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo Tópico
                </Button>
              )
            )}
          </div>
        </div>
        {renderMainContent()}
      </div>
    </div>
  );
}
