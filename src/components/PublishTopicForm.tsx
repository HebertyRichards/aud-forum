"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor";
import { useTranslations } from "next-intl";

interface PublishFormProps<T extends "topic" | "comment"> {
  type: T;
  onSubmit: () => void;
  isSubmitting?: boolean;
  className?: string;
  content: string;
  setContent: (value: string) => void;
  title?: string;
  setTitle?: (value: string) => void;
  onImageAdd?: (file: File) => void;
}

export function PublishForm<T extends "topic" | "comment">({
  type,
  onSubmit,
  isSubmitting = false,
  content,
  setContent,
  title,
  setTitle,
  onImageAdd,
}: PublishFormProps<T>) {
  const tCommon = useTranslations("common");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const formId = `publish-${type}-form`;

  return (
    <div className="flex w-full gap-6">
      <Card className="flex-1 bg-slate-800 text-white border-slate-700">
        <CardHeader>
          <CardTitle>
            {type === "topic"
              ? tCommon("publishTopic")
              : tCommon("publishComment")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id={formId} onSubmit={handleSubmit}>
            <div className="space-y-6">
              {type === "topic" && (
                <div className="space-y-2">
                  <Label htmlFor="topic-title">{tCommon("topicTitle")}</Label>
                  <Input
                    id="topic-title"
                    placeholder={tCommon("topicTitlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle?.(e.target.value)}
                    className="border-slate-600 bg-slate-700"
                    required
                  />
                </div>
              )}
              <div className="space-y-2 bg-slate-700">
                <RichTextEditor
                  content={content}
                  setContent={setContent}
                  onImageAdd={onImageAdd}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600"
            form={formId}
          >
            {isSubmitting
              ? tCommon("submitting")
              : type === "topic"
              ? tCommon("publishTopic")
              : tCommon("publishComment")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
