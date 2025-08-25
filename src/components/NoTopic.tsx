import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onNewTopicClick: () => void;
}

export function EmptyState({ onNewTopicClick }: EmptyStateProps) {
  return (
    <Card className="border border-gray-700 p-4 text-center bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Nenhum tópico encontrado</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-6">
          Não há tópicos nesta seção ainda. Seja o primeiro a iniciar uma
          discussão!
        </p>
        <Button
          onClick={onNewTopicClick}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Criar Novo Tópico
        </Button>
      </CardContent>
    </Card>
  );
}
