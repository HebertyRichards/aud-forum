import { PublishForm, PublishFormProps } from "./PublishTopicForm";
interface CreateTopicViewProps {
  onSubmit: PublishFormProps<"topic">["onSubmit"];
  isSubmitting: boolean;
}

export function CreateTopicView({
  onSubmit,
  isSubmitting,
}: CreateTopicViewProps) {
  return (
    <div className="flex w-full max-w-6xl mx-auto gap-6 p-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white mb-4">
          Criar Novo Tópico
        </h1>
        <PublishForm
          type="topic"
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          className="bg-white dark:bg-gray-800"
        />
      </div>
    </div>
  );
}
