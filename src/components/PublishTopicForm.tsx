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
