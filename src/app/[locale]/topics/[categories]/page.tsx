"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/NoTopic";
import { CreateTopicView } from "@/components/CreateTopicView";
import {
  PlusCircle,
  ArrowLeft,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPostTimestamp } from "@/utils/dateUtils";
import { useAuth } from "@/providers/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { topicService } from "@/services";
import { useGetTopicsByCategory } from "@/hooks/useGetTopicsByCategory";
import { TopicSummary } from "@/schema/forum";
import { toast } from "sonner";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  isFetching,
}: PaginationControlsProps & { isFetching: boolean }) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      if (currentPage > 2) {
        pages.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return [...new Set(pages)];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isFetching}
        className="h-9 w-9 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Anterior</span>
      </Button>
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            disabled={isFetching}
            className="h-9 w-9 p-0"
          >
            {page}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isFetching}
        className="h-9 w-9 p-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próxima</span>
      </Button>
    </div>
  );
};

export default function CategoryTopicPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const category = (params.categories as string) || "";
  const isCategoryValid = Object.keys(category).includes(category);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"list" | "create">("list");
  const { canCreateTopic, isCheckingTopic, checkTopicPermission } =
    usePermissions();

  const { isLoading, data, isFetching, TOPICS_PER_PAGE } = useGetTopicsByCategory(
    category,
    currentPage,
    view === "list"
  );

  const topics = data?.data ?? [];
  const totalTopics = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalTopics / TOPICS_PER_PAGE);
  const pageTitle = category ?? "Tópicos";

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
          topicService.getTopicsByCategory(category, currentPage + 1, TOPICS_PER_PAGE),
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
    if (!user) {
      toast.error("É necessário estar logado para criar um tópico.");
      return;
    }
    if (canCreateTopic === false) {
      toast.error(
        "Você não tem permissão para criar um tópico nesta categoria."
      );
      return;
    }
    if (canCreateTopic) {
      setView("create");
    }
  };

  const handleBackToList = () => {
    setView("list");
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 text-white">
      <h1 className="text-xl font-bold">{pageTitle}</h1>
      <div className="flex gap-2">
        {view === "create" ? (
          <Button
            className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
            onClick={handleBackToList}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        ) : (
          <Button
            onClick={handleNewTopicClick}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isCheckingTopic || !isCategoryValid}
            size="sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {isCheckingTopic ? "Verificando..." : "Novo Tópico"}
          </Button>
        )}
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-10 text-white">Carregando tópicos...</div>
      );
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
          .filter((topic: TopicSummary) => !!topic.slug)
          .map((topic: TopicSummary) => (
            <Link
              href={`/topics/${category}/${topic.slug}`}
              key={topic.slug}
              className="block"
            >
              <Card className="p-4 border bg-slate-800 border-gray-700 hover:border-blue-500 transition-colors duration-300 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={topic.profiles.avatar_url || undefined}
                        alt={`avatar de ${topic.profiles.username}`}
                      />
                      <AvatarFallback className="bg-slate-600">
                        {topic.profiles.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{topic.title}</h3>
                      <p className="text-xs text-slate-500">
                        por {topic.profiles.username} •{" "}
                        {formatPostTimestamp(topic.created_in)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
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
        <div className="mb-6 border-">
          <Button
            className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
            asChild
          >
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