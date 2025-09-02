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
import { PublishFormProps } from "@/types/post";
import { RichTextEditor } from "./RichTextEditor";

export function PublishForm<T extends "topic" | "comment">({
  type,
  onSubmit,
  isSubmitting = false,
  content,
  setContent,
  title,
  setTitle,
}: PublishFormProps<T>) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const formId = `publish-${type}-form`;

  return (
    <div className="flex w-full gap-6">
      <Card className="flex-1 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>
            {type === "topic"
              ? "Publique um novo tópico"
              : "Adicionar um comentário"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id={formId} onSubmit={handleSubmit}>
            <div className="space-y-6">
              {type === "topic" && (
                <div className="space-y-2">
                  <Label htmlFor="topic-title">Título do tópico</Label>
                  <Input
                    id="topic-title"
                    placeholder="Digite o título do seu tópico aqui..."
                    value={title}
                    onChange={(e) => setTitle?.(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <RichTextEditor content={content} setContent={setContent} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form={formId}
          >
            {isSubmitting
              ? "Enviando..."
              : type === "topic"
              ? "Publicar Tópico"
              : "Enviar Comentário"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
