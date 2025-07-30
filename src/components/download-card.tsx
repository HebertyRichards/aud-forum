import { Card } from "@/components/ui/card";
import { Eye, MessageSquare } from "lucide-react";

// Definindo as propriedades que o nosso card vai receber
type DownloadCardProps = {
  icon: React.ReactNode;
  title: string;
  author: string;
  postDate: string;
  replies: number;
  views: number;
};

export function DownloadCard({
  icon,
  title,
  author,
  postDate,
  replies,
  views,
}: DownloadCardProps) {
  return (
    <Card className="border border-gray-700 p-4 hover:border-blue-500 transition-colors bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 text-blue-400">{icon}</div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg text-white hover:text-blue-400 cursor-pointer">
            {title}
          </h3>
          <p className="text-sm text-gray-400">
            Postado por{" "}
            <a href="#" className="font-semibold text-gray-300 hover:underline">
              {author}
            </a>
            <span className="mx-2">&middot;</span>
            {postDate}
          </p>
        </div>
        <div className="hidden sm:flex flex-shrink-0 items-center gap-6 text-sm text-right text-gray-300">
          <div
            className="flex items-center gap-2"
            title={`${replies} mensagens`}
          >
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <span className="font-semibold">{replies}</span>
            <span className="hidden md:inline">Mensagens</span>
          </div>
          <div
            className="flex items-center gap-2"
            title={`${views} visualizações`}
          >
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="font-semibold">{views}</span>
            <span className="hidden md:inline">Visualizações</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
