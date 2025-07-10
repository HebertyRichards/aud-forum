import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Users, Eye, Clock, Pin, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ForumHome() {
  const categories = [
    {
      id: 1,
      name: "Avisos da Liderança",
      description: "Comunicados importantes da liderança da família",
      posts: 23,
      topics: 8,
      lastPost: {
        title: "Novas regras internas - Leiam todos!",
        author: "Don_Auditore",
        time: "1 hora atrás",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      isPinned: true,
    },
    {
      id: 2,
      name: "Discussões Gerais",
      description: "Conversas gerais entre os membros da família",
      posts: 456,
      topics: 67,
      lastPost: {
        title: "Melhor estratégia para territórios",
        author: "Soldado_Marco",
        time: "30 min atrás",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: 3,
      name: "Membros",
      description: "Apresentações, promoções e assuntos dos membros",
      posts: 234,
      topics: 45,
      lastPost: {
        title: "Apresentação - Novo na família",
        author: "Recruta_João",
        time: "2 horas atrás",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: 4,
      name: "Eventos & Atividades",
      description: "Eventos da família e atividades em grupo",
      posts: 189,
      topics: 34,
      lastPost: {
        title: "Guerra marcada para hoje às 21h",
        author: "Capitão_Silva",
        time: "45 min atrás",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: 5,
      name: "Galeria",
      description: "Screenshots e vídeos dos membros",
      posts: 123,
      topics: 28,
      lastPost: {
        title: "Fotos da última guerra",
        author: "Fotografo_Luis",
        time: "3 horas atrás",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: 6,
      name: "Suporte & Dúvidas",
      description: "Ajuda e esclarecimento de dúvidas",
      posts: 67,
      topics: 19,
      lastPost: {
        title: "Como usar o sistema de ranks?",
        author: "Novato_Pedro",
        time: "4 horas atrás",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
  ]

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
  ]

  const onlineUsers = [
    { name: "Admin", status: "online", avatar: "/placeholder.svg?height=24&width=24" },
    { name: "PlayerOne", status: "online", avatar: "/placeholder.svg?height=24&width=24" },
    { name: "MechanicPro", status: "online", avatar: "/placeholder.svg?height=24&width=24" },
    { name: "EventManager", status: "away", avatar: "/placeholder.svg?height=24&width=24" },
    { name: "Newbie123", status: "online", avatar: "/placeholder.svg?height=24&width=24" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Auditore</h1>
                <Badge variant="secondary" className="ml-2">
                  Família
                </Badge>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-blue-600 font-medium">
                Início
              </Link>
              <Link href="/forum" className="text-gray-600 hover:text-gray-900">
                Fórum
              </Link>
              <Link href="/members" className="text-gray-600 hover:text-gray-900">
                Membros
              </Link>
              <Link href="/rules" className="text-gray-600 hover:text-gray-900">
                Regras
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
              <Button size="sm">Registrar</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Categorias do Fórum</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {categories.map((category) => (
                    <div key={category.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            {category.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{category.topics} tópicos</span>
                            <span>{category.posts} posts</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{category.lastPost.title}</div>
                            <div className="text-xs text-gray-500">
                              por {category.lastPost.author} • {category.lastPost.time}
                            </div>
                          </div>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={category.lastPost.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{category.lastPost.author[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Últimas Publicações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{post.title}</h4>
                            {post.isPinned && <Pin className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                            {post.isHot && <Star className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              por <span className="font-medium">{post.author}</span>
                            </span>
                            <span>
                              em <span className="font-medium">{post.category}</span>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
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
                  <span className="font-semibold text-blue-600">Recruta_João</span>
                </div>
              </CardContent>
            </Card>

            {/* Online Users */}
            <Card>
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
                          <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Criar Novo Tópico
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Lista de Membros
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Posts em Destaque
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Atividade Recente
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
