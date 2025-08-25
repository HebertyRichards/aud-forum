"use client";

import * as React from "react";
import { DownloadCard } from "@/components/download/download-card";
import { EmptyState } from "@/components/NoTopic";
import { CreateTopicView } from "@/components/CreateTopicView";
import { Car, Music, Search, PlusCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_TOPICS = [
  {
    icon: <Car size={32} />,
    title: "Menu de Carros",
    author: "AizeN_Auditore",
    postDate: "Sex, 26 Jul 2024 - 15:42",
    replies: 175,
    views: 2349,
  },
  {
    icon: <Music size={32} />,
    title: "Pack de Sons para Viaturas",
    author: "voyna",
    postDate: "Qua, 24 Jul 2024 - 11:03",
    replies: 98,
    views: 1821,
  },
];

export default function Downloads() {
  const [view, setView] = React.useState<"list" | "create" | "empty">("list");
  const [topics, setTopics] = React.useState(MOCK_TOPICS);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (topics.length === 0) {
      setView("empty");
    } else {
      setView("list");
    }
  }, [topics]);

  const handleCreateTopicSubmit = (data: {
    title: string;
    content: string;
    category: string;
  }) => {
    console.log("Submitting new topic:", data);
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Tópico "${data.title}" criado com sucesso!`);
      setView("list");
      setIsSubmitting(false);
    }, 1500);
  };

  const renderContent = () => {
    switch (view) {
      case "create":
        return (
          <CreateTopicView
            onSubmit={handleCreateTopicSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case "empty":
        return <EmptyState onNewTopicClick={() => setView("create")} />;
      case "list":
      default:
        return (
          <div className="space-y-3">
            {topics.map((topic, index) => (
              <DownloadCard key={index} {...topic} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-gray-300 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Downloads</h1>
          <div className="flex gap-2">
            <Button variant="ghost" className="hover:bg-gray-700">
              <Search className="h-4 w-4 mr-2" />
              Procurar
            </Button>
            {view === "create" ? (
              <Button
                variant="outline"
                onClick={() => setView(topics.length > 0 ? "list" : "empty")}
              >
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
        <div className="text-sm text-gray-400 mb-6"></div>

        {renderContent()}
      </div>
    </div>
  );
}
