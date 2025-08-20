import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, PlusCircle, Pencil, Eye } from "lucide-react";
import Link from "next/link";

export default function Subscribe() {
  const posts = [
    {
      id: 1,
      title: "[INSCRIÇÃO] Teste",
      author: "royme",
      authorInitials: "RO",
      authorAvatar: "/placeholder.svg?height=80&width=80",
      messages: 9,
      views: 77,
      date: "Qui 19 Out 2023 - 7:25",
      isOnline: true,
    },
  ];

  return (
    <div className="min-h-screen dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Família Auditore</span> › <span>Inscreva-se</span>
        </div>
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Novas mensagens
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Tópicos sem resposta
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Seguir este fórum
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
          <Pencil className="w-5 h-5" />
            Marcar todos os tópicos como lidos
          </Button>
        </div>
        <Card className="mb-6 p-0 bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg p-4">
            <CardTitle className="text-lg font-semibold flex justify-between items-center">
              <span>Inscreva-se</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <Link
                  href="/subscribe/old"
                  className="font-semibold text-blue-500"
                >
                  Inscrições Antigas
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Qua 10 Nov 2021 - 22:03
                </p>
                <p className="text-xs text-blue-500 font-semibold">
                  KiraOkami_Auditore
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg">175</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  POSTS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-full sm:w-48">
              <Input type="text" placeholder="Procurar" className="pr-10" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo tópico
            </Button>
          </div>
        </div>
        <Card className="mb-6 bg-white dark:bg-gray-800 shadow-md">
          <CardContent className="p-0">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:space-x-4 border-b last:border-b-0"
              >
                <Avatar className="w-20 h-20 rounded-md mb-4 sm:mb-0 flex-shrink-0">
                  <AvatarImage src={post.authorAvatar} />
                  <AvatarFallback className="rounded-md">
                    {post.author.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  {" "}
                  <h3 className="font-bold text-lg text-blue-500 mb-1 break-words">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Postado por{" "}
                    <span className="font-semibold text-blue-500">
                      {post.author}
                    </span>
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>{post.date}</span>
                    {post.isOnline && (
                      <span className="text-green-500 font-semibold">
                        royme
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-x-4 sm:gap-x-0 sm:space-y-2 text-sm mt-4 sm:mt-0 w-full sm:w-auto justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="whitespace-nowrap">
                      {post.messages} Mensagens
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span className="whitespace-nowrap">
                      {post.views} Visualizações
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
