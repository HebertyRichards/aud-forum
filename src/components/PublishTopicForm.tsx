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
import * as React from "react";

interface Forum {
  id: string;
  name: string;
}

interface PublishTopicFormProps {
  forums: Forum[];
  onSubmit: (data: {
    icon: string;
    title: string;
    content: string;
    forumId: string;
  }) => void;
  isSubmitting?: boolean;
}

export function PublishTopicForm({
  forums,
  onSubmit,
  isSubmitting = false,
}: PublishTopicFormProps) {
  const [selectedIcon, setSelectedIcon] = React.useState("default");
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [selectedForum, setSelectedForum] = React.useState<string>(
    forums[0]?.id || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      icon: selectedIcon,
      title,
      content,
      forumId: selectedForum,
    });
  };

  return (
    <div className="flex w-full max-w-6xl mx-auto gap-6 p-4">
      <Card className="flex-1 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Publique um novo tópico</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="publish-topic-form" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic-title">Título do tópico</Label>
                <Input
                  id="topic-title"
                  placeholder="Nenhuma"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
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
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div>
            <Button
              type="submit"
              form="publish-topic-form"
              disabled={isSubmitting}
              className="ml-2"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </CardFooter>
      </Card>
      <div className="w-1/4 max-w-xs">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="p-4">
            <h3 className="font-semibold text-sm">Smileys</h3>
          </CardHeader>
          <CardContent className="p-4 max-h-64 overflow-y-auto text-xl grid grid-cols-5 gap-2">
            {smilies.map((smiley, index) => (
              <span
                key={index}
                className="cursor-pointer hover:bg-accent rounded-md text-center"
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

const ToolbarButton = ({
  icon,
  tooltip,
}: {
  icon: React.ReactNode;
  tooltip: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);
