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
import { ForumCategory } from "@/types/forum";

export const forumStructure: ForumCategory[] = [
  {
    id: "area-oculta",
    title: "Área Oculta",
    subItems: [
      { 
        icon: Annoyed, 
        title: "Regras", 
        href: "/rules" 
      }
    ],
  },
  {
    id: "auditore",
    title: "Auditore",
    subItems: [
      { 
        icon: Bell, 
        title: "Atualizações", 
        href: "/topics/updates" 
      },
      { 
        icon: Pencil, 
        title: "Inscreva-se", 
        href: "/topics/subscribe" 
      },
      { 
        icon: Album, 
        title: "Sobre", 
        href: "/about" 
      },
    ],
  },
  {
    id: "info-gerais",
    title: "Informações Gerais",
    subItems: [
      { 
        icon: Users, 
        title: "Membros", 
        href: "/topics/members" 
      },
      {
        icon: MessagesSquare,
        title: "Discussões Gerais",
        href: "/topics/general-discussions",
      },
      { 
        icon: FileText, 
        title: "Manuais", 
        href: "/topics/manuals" 
      },
      { 
        icon: Download, 
        title: "Downloads", 
        href: "/topics/downloads" 
      },
    ],
  },
];