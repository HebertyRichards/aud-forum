"use client";

import { PublishForm } from "./PublishTopicForm";
import { useCreateTopic } from "@/hooks/useCreateTopic";

export function CreateTopicView({ category }: { category: string }) {
  const {
    title,
    setTitle,
    content,
    setContent,
    isSubmitting,
    error,
    handleTopicSubmit,
    addImage,
  } = useCreateTopic(category);

  return (
    <div className="flex w-full max-w-6xl mx-auto gap-6 p-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">Criar Novo Tópico</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <PublishForm
          type="topic"
          onSubmit={() => handleTopicSubmit(true)}
          isSubmitting={isSubmitting}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onImageAdd={addImage}
          className="bg-white dark:bg-slate-800"
        />
      </div>
    </div>
  );
}
