import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  Book,
  MessagesSquare,
  Users,
  PenSquare,
  Megaphone,
} from "lucide-react";

const forumCategories = [
  {
    href: "/topics/downloads",
    title: "Downloads",
    description: "Encontre e compartilhe mods, scripts e ferramentas.",
    icon: <Download className="h-8 w-8 text-blue-500" />,
  },
  {
    href: "/topics/manuais",
    title: "Manuais",
    description: "Guias, tutoriais e documentação oficial da equipe.",
    icon: <Book className="h-8 w-8 text-yellow-500" />,
  },
  {
    href: "/topics/discussoes-gerais",
    title: "Discussões Gerais",
    description:
      "Converse sobre assuntos diversos e interaja com a comunidade.",
    icon: <MessagesSquare className="h-8 w-8 text-purple-500" />,
  },
  {
    href: "/topics/membros",
    title: "Área dos Membros",
    description: "Tópicos e discussões exclusivas para membros da equipe.",
    icon: <Users className="h-8 w-8 text-teal-500" />,
  },
  {
    href: "/topics/inscricoes",
    title: "Inscrições",
    description: "Formulários e informações para se tornar um membro.",
    icon: <PenSquare className="h-8 w-8 text-orange-500" />,
  },
  {
    href: "/topics/atualizacoes",
    title: "Atualizações",
    description: "Acompanhe as entradas e saídas de membros da equipe.",
    icon: <Megaphone className="h-8 w-8 text-green-500" />,
  },
];

export default function TopicsIndexPage() {
  return (
    <div className="min-h-screen text-gray-300 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Fóruns</h1>
          <p className="text-lg text-gray-400">
            Navegue pelas categorias para encontrar o que procura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forumCategories.map((category) => (
            <Link href={category.href} key={category.href} className="group">
              <Card className="border border-gray-700 bg-gray-800/50 hover:border-blue-500 hover:bg-gray-800 transition-all duration-300 h-full">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div>{category.icon}</div>
                  <div>
                    <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {category.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
