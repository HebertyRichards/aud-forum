"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/NoTopic";
import { CreateTopicView } from "@/components/CreateTopicView";
import {
  PlusCircle,
  ArrowLeft,
  MessageSquare,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPostTimestamp } from "@/utils/dateUtils";
import { useAuth } from "@/services/auth";
import { getTopicsByCategory } from "@/services/topic";
import { usePermissions } from "@/hooks/usePermissions";
import { PaginationControlsProps, TopicSummary } from "@/types/post";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  isFetching,
}: PaginationControlsProps & { isFetching: boolean }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isFetching}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Anterior
      </Button>
      <span className="text-sm font-medium">
        Página {currentPage} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isFetching}
      >
        Próxima
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

const MessageCard = ({ message }: { message: string }) => (
  <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-gray-800">
    <CardContent className="p-6 flex items-center gap-4">
      <AlertTriangle className="h-8 w-8 text-yellow-500" />
      <p className="text-yellow-700 dark:text-yellow-300 font-medium">
        {message}
      </p>
    </CardContent>
  </Card>
);

const categoryTitles: { [key: string]: string } = {
  downloads: "Downloads",
  manuals: "Manuais",
  "general-discussions": "Discussões Gerais",
  members: "Área dos Membros",
  subscribes: "Inscrições",
  updates: "Atualizações",
};

export default function CategoryTopicPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const category = (params.categories as string) || "";
  const isCategoryValid =
    !!category && Object.keys(categoryTitles).includes(category);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"list" | "create">("list");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const { canCreateTopic, isCheckingTopic, checkTopicPermission } =
    usePermissions();
  const TOPICS_PER_PAGE = 10;

  const { isLoading, data, isFetching } = useQuery<
    { data: TopicSummary[]; totalCount: number },
    Error
  >({
    queryKey: ["topics", category, currentPage],
    queryFn: () => getTopicsByCategory(category, currentPage, TOPICS_PER_PAGE),
    enabled: isCategoryValid && view === "list",
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const topics = data?.data ?? [];
  const totalTopics = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalTopics / TOPICS_PER_PAGE);
  const pageTitle = categoryTitles[category] || "Tópicos";

  useEffect(() => {
    if (user && category) {
      checkTopicPermission(category);
    }
  }, [user, category, checkTopicPermission]);

  useEffect(() => {
    if (category && !isCategoryValid) {
      router.replace("/not-found");
    }
  }, [category, isCategoryValid, router]);

  useEffect(() => {
    if (currentPage < totalPages && isCategoryValid) {
      queryClient.prefetchQuery({
        queryKey: ["topics", category, currentPage + 1],
        queryFn: () =>
          getTopicsByCategory(category, currentPage + 1, TOPICS_PER_PAGE),
      });
    }
  }, [currentPage, totalPages, category, isCategoryValid, queryClient]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleNewTopicClick = () => {
    setAuthMessage(null);

    if (!user) {
      setAuthMessage("É necessário estar logado para criar um tópico.");
      return;
    }
    if (canCreateTopic === false) {
      setAuthMessage(
        "Você não tem permissão para criar um tópico nesta seção."
      );
      return;
    }
    if (canCreateTopic) {
      setView("create");
    }
  };

  const handleBackToList = () => {
    setView("list");
    setAuthMessage(null);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{pageTitle}</h1>
      <div className="flex gap-2">
        {view === "create" ? (
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        ) : (
          <Button
            onClick={handleNewTopicClick}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isCheckingTopic || !isCategoryValid}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {isCheckingTopic ? "Verificando..." : "Novo Tópico"}
          </Button>
        )}
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (authMessage) {
      return <MessageCard message={authMessage} />;
    }

    if (isLoading) {
      return <div className="text-center p-10">Carregando tópicos...</div>;
    }
    if (authMessage) {
      return <MessageCard message={authMessage} />;
    }

    if (view === "create") {
      return <CreateTopicView category={category} />;
    }

    if (topics.length === 0) {
      return <EmptyState onNewTopicClick={handleNewTopicClick} />;
    }

    return renderTopicList();
  };
  const renderTopicList = () => (
    <>
      <div className={`space-y-4 ${isFetching ? "opacity-70" : ""}`}>
        {topics
          .filter((topic) => !!topic.slug)
          .map((topic) => (
            <Link
              href={`/topics/${category}/${topic.slug}`}
              key={topic.slug}
              className="block"
            >
              <Card className="p-4 border border-gray-700 bg-white hover:border-blue-500 transition-colors duration-300 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={topic.profiles.avatar_url || undefined}
                      />
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
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isFetching={isFetching}
      />
    </>
  );

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
        {renderHeader()}
        {renderMainContent()}
      </div>
    </div>
  );
}
