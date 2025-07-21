import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ForumTopicRow } from "@/components/ForumTopicRow";
import {
  MessageSquare,
  Annoyed,
  FileText,
  Download,
  Users,
  MessagesSquare,
  Pencil,
  Bell,
  Eye,
  Clock,
  Pin,
  Star,
  Album,
} from "lucide-react";

type Topic = {
  id: number;
  icon: typeof MessageSquare;
  title: string;
  lastPostInfo: string;
  author: string;
  authorColorClass: string;
  postCount: number;
  hasInfoIcon?: boolean;
};

type Category = {
  id: string;
  title: string;
  topics: Topic[];
};

// se for membro da family ou autorizado pelo dono aparece area oculta
const forumData: Category[] = [
  {
    id: "area-oculta",
    title: "Área Oculta",
    topics: [
      {
        id: 1,
        icon: Annoyed,
        title: "Regras",
        lastPostInfo: "Qui 15 Ago 2021 - 15:09",
        author: "Admin_Auditore--",
        authorColorClass: "text-red-600",
        postCount: 2,
        hasInfoIcon: true,
      },
    ],
  },
  {
    id: "auditore",
    title: "Auditore",
    topics: [
      {
        id: 1,
        icon: Bell,
        title: "Atualizações",
        lastPostInfo: "Qua 1 Dez 2021 - 20:11",
        author: "xMatheus_Auditore--",
        authorColorClass: "text-blue-600",
        postCount: 37,
      },
      {
        id: 2,
        icon: Pencil,
        title: "Inscreva-se",
        lastPostInfo: "Qui 19 Out 2023 - 7:25",
        author: "insyne--",
        authorColorClass: "text-purple-600",
        postCount: 176,
        hasInfoIcon: true,
      },
      {
        id: 3,
        icon: Album,
        title: "Sobre",
        lastPostInfo: "Qui 20 Out 2023 - 7:30",
        author: "insyne--",
        authorColorClass: "text-purple-600",
        postCount: 176,
        hasInfoIcon: true,
      },
    ],
  },
  {
    id: "info-gerais",
    title: "Informações Gerais",
    topics: [
      {
        id: 1,
        icon: Users,
        title: "Membros",
        lastPostInfo: "Qua 25 Maio 2020 - 12:48",
        author: "Admin_Auditore--",
        authorColorClass: "text-red-600",
        postCount: 1,
        hasInfoIcon: true,
      },
      {
        id: 2,
        icon: MessagesSquare,
        title: "Discussões Gerais",
        lastPostInfo: "Seg 25 Maio 2020 - 15:13",
        author: "EMKz--",
        authorColorClass: "text-green-600",
        postCount: 1,
        hasInfoIcon: true,
      },
      {
        id: 3,
        icon: FileText,
        title: "Manuais",
        lastPostInfo: "Dom 23 Maio 2021 - 23:25",
        author: "Member_Auditore--",
        authorColorClass: "text-cyan-600",
        postCount: 37,
      },
      {
        id: 4,
        icon: Download,
        title: "Downloads",
        lastPostInfo: "",
        author: "",
        authorColorClass: "",
        postCount: 0,
      },
    ],
  },
];

export default function ForumHome() {
  const recentPosts = [
    {
      id: 1,
      title: "Reunião de liderança - Resultados",
      author: "Don_Auditore",
      category: "Avisos da Liderança",
      replies: 15,
      views: 234,
      time: "20 min atrás",
      avatar: "/placeholder.svg?height=32&width=32",
      isPinned: true,
    },
    {
      id: 2,
      title: "Parabéns ao membro do mês!",
      author: "Sub_Boss",
      category: "Membros",
      replies: 28,
      views: 456,
      time: "1 hora atrás",
      avatar: "/placeholder.svg?height=32&width=32",
      isHot: true,
    },
    {
      id: 3,
      title: "Estratégias para a próxima guerra",
      author: "Estrategista_Carlos",
      category: "Discussões Gerais",
      replies: 42,
      views: 678,
      time: "2 horas atrás",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      title: "Evento de integração - Sábado",
      author: "Organizador_Ana",
      category: "Eventos & Atividades",
      replies: 19,
      views: 123,
      time: "3 horas atrás",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  const onlineUsers = [
    {
      name: "Admin",
      status: "online",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      name: "PlayerOne",
      status: "online",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      name: "MechanicPro",
      status: "online",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      name: "EventManager",
      status: "away",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    {
      name: "Newbie123",
      status: "online",
      avatar: "/placeholder.svg?height=24&width=24",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <main className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
            <div className="w-full max-w-5xl mx-auto">
              <Accordion
                type="multiple"
                defaultValue={["auditore", "info-gerais", "area-oculta"]}
                className="space-y-6"
              >
                {forumData.map((category) => (
                  <AccordionItem
                    key={category.id}
                    value={category.id}
                    className="border-none rounded-md overflow-hidden shadow-md"
                  >
                    <AccordionTrigger className="bg-blue-600 px-4 py-2 text-base font-semibold hover:no-underline hover:brightness-110 w-full">
                      {category.title}
                    </AccordionTrigger>
                    <AccordionContent className="p-0 divide-y divide-border bg-white dark:bg-gray-800">
                      {category.topics.length > 0 ? (
                        category.topics.map((topic) => (
                          <ForumTopicRow key={topic.id} {...topic} />
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Nenhum tópico nesta seção.
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </main>
          <div className="p-4 sm:p-6 md:p-8">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={post.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium truncate hover:underline cursor-pointer">
                              {post.title}
                            </h4>
                            {post.isPinned && (
                              <Pin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                            {post.isHot && (
                              <Star className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              por{" "}
                              <span className="font-medium">{post.author}</span>
                            </span>
                            <span>
                              em{" "}
                              <span className="font-medium">
                                {post.category}
                              </span>
                            </span>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Membros Ativos</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Posts Totais</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tópicos Totais</span>
                <span className="font-semibold">201</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Novo Membro</span>
                <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                  Recruta_João
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Usuários Online</span>
                <Badge variant="secondary" className="ml-auto">
                  5
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onlineUsers.map((user, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="relative">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === "online"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium hover:underline cursor-pointer">
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
