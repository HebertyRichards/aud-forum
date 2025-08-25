"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/NoTopic"; 
import { CreateTopicView } from "@/components/CreateTopicView"; 
import { PlusCircle, ArrowLeft } from "lucide-react";

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
  const category = (params.category as string) || "";

  const [view, setView] = React.useState<"list" | "create">("list");
  const [topics, setTopics] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateTopicSubmit = (data: {
    title: string;
    content: string;
  }) => {
    console.log("Novo tópico submetido na categoria:", category, data);
    setIsSubmitting(true);

    setTimeout(() => {
      alert(
        `Seu tópico "${data.title}" seria criado na categoria "${category}"`
      );
      setIsSubmitting(false);
      setView("list");
    }, 1500);
  };

  const renderMainContent = () => {
    if (category === "atualizacoes" && view === "list") {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Selecione uma opção de atualização
          </h2>
          <div className="flex justify-center gap-4">
            <Button>Entrada de Membros</Button>
            <Button variant="destructive">Retirada de Membros</Button>
          </div>
        </div>
      );
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
      return <EmptyState onNewTopicClick={() => setView("create")} />; //
    }

    return (
      <div className="space-y-3">
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
              <Button
                onClick={() => setView("create")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Tópico
              </Button>
            )}
          </div>
        </div>

        {renderMainContent()}
      </div>
    </div>
  );
}
