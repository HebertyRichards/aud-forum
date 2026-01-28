"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type EmptyStateProps = {
  onNewTopicClick: () => void;
};

export function EmptyState({ onNewTopicClick }: EmptyStateProps) {
  const t = useTranslations("topics");

  return (
    <Card className="border dark:border-slate-700 p-4 text-center dark:bg-slate-800 border-slate-100 bg-slate-200">
      <CardHeader>
        <CardTitle>{t("noTopicsInCategory")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-400 mb-6">
          {t("beFirstToPost")}
        </p>
        <Button
          onClick={onNewTopicClick}
          className="bg-blue-500 hover:bg-blue-400 dark:hover:bg-blue-600"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("createTopic")}
        </Button>
      </CardContent>
    </Card>
  );
}
