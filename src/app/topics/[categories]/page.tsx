"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/NoTopic";
import { CreateTopicView } from "@/components/CreateTopicView";
import { PlusCircle, ArrowLeft, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatLastLogin } from "@/utils/dateUtils";
import { useAuth } from "@/services/auth";
import {
  getTopicsByCategory,
  createTopic,
  NewTopicData,
} from "@/services/topic";

interface TopicSummary {
  id: number;
  title: string;
  slug: string;
  created_in: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
  comentarios: [{ count: number }];
}

const categoryTitles: { [key: string]: string } = {
  downloads: "Downloads",
  manuais: "Manuais",
  "discussoes-gerais": "Discussões Gerais",
  membros: "Área dos Membros",
  inscricoes: "Inscrições",
  atualizacoes: "Atualizações",
};

export default function CategoryTopicPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const category = (params.categories as string) || "";
  const [view, setView] = React.useState<"list" | "create">("list");
  const [topics, setTopics] = React.useState<TopicSummary[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  console.log("PARAMS RECEBIDOS PELA PÁGINA:", params);

  React.useEffect(() => {
    if (view !== "list" || !category) {
      setIsLoading(false);
      return;
    }

    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const data = await getTopicsByCategory(category);
        setTopics(data);
      } catch (error) {
        console.error(error);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [category, view]);

  const handleCreateTopicSubmit = async (data: {
    title: string;
    content: string;
  }) => {
    setIsSubmitting(true);
    try {
      const topicData: NewTopicData = {
        title: data.title,
        content: data.content,
        category: category,
      };

      // Usa a função de criar tópico do seu arquivo topic.ts
      // A autenticação é tratada automaticamente pelo cookie (credentials: 'include')
      const newTopic = await createTopic(topicData);

      // Redireciona para o novo tópico após a criação bem-sucedida
      router.push(`/topics/${category}/${newTopic.slug}`);
    } catch (error) {
      console.error("Erro ao criar tópico:", error);
      alert((error as Error).message);
      setIsSubmitting(false);
    }
  };

  const renderMainContent = () => {
    if (isLoading) {
      return <div className="text-center p-10">Carregando tópicos...</div>;
    }

    if (view === "create") {
      return (
        <CreateTopicView
          onSubmit={handleCreateTopicSubmit}
          isSubmitting={isSubmitting}
        />
      );
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
            <Card className="p-4 border border-gray-700 bg-gray-800/50 hover:border-blue-500 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={topic.profiles.avatar_url} />
                    <AvatarFallback>
                      {topic.profiles.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      por {topic.profiles.username} •{" "}
                      {formatLastLogin(topic.created_in)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
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
    <div className="min-h-screen text-gray-300 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
          <div className="flex gap-2">
            {view === "create" ? (
              <Button variant="outline" onClick={() => setView("list")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            ) : (
              // Mostra o botão de Novo Tópico apenas se o usuário estiver logado
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
