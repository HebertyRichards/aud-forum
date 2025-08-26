import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { smilies } from "@/utils/smiles";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Smile,
  Paperclip,
} from "lucide-react";
import { TopicFormData, CommentFormData, PublishFormProps } from "@/types/post";


const ToolbarButton = ({
  icon,
  tooltip,
}: {
  icon: React.ReactNode;
  tooltip: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label={tooltip}
        type="button"
      >
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export function PublishForm<T extends "topic" | "comment">({
  type,
  onSubmit,
  isSubmitting = false,
}: PublishFormProps<T>) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "topic") {
      (onSubmit as (data: TopicFormData) => void)({
        title,
        content,
        category: "",
      });
    } else {
      (onSubmit as (data: CommentFormData) => void)({
        content,
      });
    }
  };

  const handleSmileyClick = (smiley: string) => {
    setContent((prevContent) => prevContent + smiley);
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
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <TooltipProvider delayDuration={100}>
                  <div className="border rounded-t-md p-2 flex items-center gap-1 flex-wrap">
                    <ToolbarButton
                      tooltip="Negrito"
                      icon={<Bold size={16} />}
                    />
                    <ToolbarButton
                      tooltip="Itálico"
                      icon={<Italic size={16} />}
                    />
                    <ToolbarButton
                      tooltip="Sublinhado"
                      icon={<Underline size={16} />}
                    />
                    <ToolbarButton
                      tooltip="Tachado"
                      icon={<Strikethrough size={16} />}
                    />
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <ToolbarButton tooltip="Link" icon={<Link size={16} />} />
                    <ToolbarButton tooltip="Lista" icon={<List size={16} />} />
                    <ToolbarButton
                      tooltip="Lista ordenada"
                      icon={<ListOrdered size={16} />}
                    />
                    <ToolbarButton
                      tooltip="Citação"
                      icon={<Quote size={16} />}
                    />
                    <ToolbarButton tooltip="Código" icon={<Code size={16} />} />
                    <ToolbarButton
                      tooltip="Imagem"
                      icon={<Image size={16} />}
                    />
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <ToolbarButton
                      tooltip="Anexar arquivo"
                      icon={<Paperclip size={16} />}
                    />
                    <ToolbarButton
                      tooltip="Smileys"
                      icon={<Smile size={16} />}
                    />
                  </div>
                </TooltipProvider>
                <Textarea
                  placeholder="Escreva sua mensagem aqui..."
                  className="rounded-t-none min-h-[250px] resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting
              ? "Enviando..."
              : type === "topic"
              ? "Publicar Tópico"
              : "Enviar Comentário"}
          </Button>
        </CardFooter>
      </Card>
      <div className="w-1/4 max-w-xs hidden md:block">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="p-4">
            <h3 className="font-semibold text-sm">Smileys</h3>
          </CardHeader>
          <CardContent className="p-4 max-h-64 overflow-y-auto text-xl grid grid-cols-5 gap-2">
            {smilies.map((smiley, index) => (
              <span
                key={index}
                className="cursor-pointer hover:bg-accent rounded-md text-center"
                onClick={() => handleSmileyClick(smiley)}
              >
                {smiley}
              </span>
            ))}
          </CardContent>
          <CardFooter className="p-4 text-xs text-muted-foreground border-t">
            Os smileys estão ativados.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
