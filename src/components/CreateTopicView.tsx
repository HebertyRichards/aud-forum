"use client";

import { PublishForm } from "./PublishTopicForm";
import { useCreateTopic } from "@/hooks/useCreateTopic";
import { useTranslations } from "next-intl";

export function CreateTopicView({ category }: { category: string }) {
  const t = useTranslations("topics");
  const {
    title,
    setTitle,
    content,
    setContent,
    isSubmitting,
    handleTopicSubmit,
    addImage,
  } = useCreateTopic(category);

  return (
    <div className="flex w-full max-w-6xl mx-auto gap-6 p-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">{t("createTopic")}</h1>
        <PublishForm
          type="topic"
          onSubmit={() => handleTopicSubmit(true)}
          isSubmitting={isSubmitting}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onImageAdd={addImage}
          className="bg-slate-200 dark:bg-slate-800"
        />
      </div>
    </div>
  );
}
