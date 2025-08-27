import { PublishForm } from "./PublishTopicForm";
import { CreateTopicViewProps } from "@/types/post";

export function CreateTopicView({
  onSubmit,
  isSubmitting,
  error, 
}: CreateTopicViewProps) {
  return (
    <div className="flex w-full max-w-6xl mx-auto gap-6 p-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">
          Criar Novo Tópico
        </h1>
        <PublishForm
          type="topic"
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          error={error}
          className="bg-white dark:bg-gray-800"
        />
      </div>
    </div>
  );
}
