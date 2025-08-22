import {
  Annoyed,
  FileText,
  Download,
  Users,
  MessagesSquare,
  Pencil,
  Bell,
  Album,
} from "lucide-react";
import { OnlineUser } from "@/types/users";
import { Category, RecentPost } from "@/types/post";

// se for membro da family ou autorizado pelo dono aparece area oculta
export const forumData: Category[] = [
  {
    id: "area-oculta",
    title: "Área Oculta",
    topics: [
      {
        id: 1,
        icon: Annoyed,
        title: "Regras",
        route: "/rules",
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
        route:"/updates",
        lastPostInfo: "Qua 1 Dez 2021 - 20:11",
        author: "xMatheus_Auditore--",
        authorColorClass: "text-blue-600",
        postCount: 37,
      },
      {
        id: 2,
        icon: Pencil,
        title: "Inscreva-se",
        route:"/subscribe",
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
        route:"/about",
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
        route:"/members",
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
        route:"/general-discussions",
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
        route:"/manuals",
        lastPostInfo: "Dom 23 Maio 2021 - 23:25",
        author: "Member_Auditore--",
        authorColorClass: "text-cyan-600",
        postCount: 37,
      },
      {
        id: 4,
        icon: Download,
        title: "Downloads",
        route:"/downloads",
        lastPostInfo: "",
        author: "",
        authorColorClass: "",
        postCount: 0,
      },
    ],
  },
];

export const recentPosts: RecentPost[] = [
  { id: 1, title: "Reunião de liderança - Resultados", author: "Don_Auditore", category: "Avisos da Liderança", replies: 15, views: 234, time: "20 min atrás", avatar: "/placeholder.svg", isPinned: true },
  { id: 2, title: "Parabéns ao membro do mês!", author: "Sub_Boss", category: "Membros", replies: 28, views: 456, time: "1 hora atrás", avatar: "/placeholder.svg", isHot: true },
  { id: 3, title: "Estratégias para a próxima guerra", author: "Estrategista_Carlos", category: "Discussões Gerais", replies: 42, views: 678, time: "2 horas atrás", avatar: "/placeholder.svg" },
  { id: 4, title: "Evento de integração - Sábado", author: "Organizador_Ana", category: "Eventos & Atividades", replies: 19, views: 123, time: "3 horas atrás", avatar: "/placeholder.svg" },
];

export const onlineUsers: OnlineUser[] = [
  { username: "Admin", role:"Visitante" ,avatar_url: "/placeholder.svg" },
  { username: "PlayerOne", role:"Partner", avatar_url: "/placeholder.svg" },
  { username: "MechanicPro", role:"Fundador", avatar_url: "/placeholder.svg" },
  { username: "EventManager", role:"Leader", avatar_url: "/placeholder.svg" },
  { username: "Newbie123", role:"Membro", avatar_url: "/placeholder.svg" },
];

export const forumStats = {
  activeMembers: 47,
  totalPosts: "1,234",
  totalTopics: 201,
  newestMember: "Recruta_João",
};