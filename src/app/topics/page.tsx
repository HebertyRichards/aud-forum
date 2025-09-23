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
  HelpCircle,
} from "lucide-react";
import { ReactElement } from "react";
import { ApiCategory, UiCategory } from "@/types/post";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const categoryDetailsMap: Record<
  string,
  { description: string; icon: ReactElement }
> = {
  downloads: {
    description: "Encontre e compartilhe mods, scripts e ferramentas.",
    icon: <Download className="h-8 w-8 text-blue-500" />,
  },
  manuals: {
    description: "Guias, tutoriais e documentação oficial da equipe.",
    icon: <Book className="h-8 w-8 text-yellow-500" />,
  },
  "general-discussions": {
    description:
      "Converse sobre assuntos diversos e interaja com a comunidade.",
    icon: <MessagesSquare className="h-8 w-8 text-purple-500" />,
  },
  members: {
    description: "Tópicos e discussões exclusivas para membros da equipe.",
    icon: <Users className="h-8 w-8 text-teal-500" />,
  },
  subscribes: {
    description: "Formulários e informações para se tornar um membro.",
    icon: <PenSquare className="h-8 w-8 text-orange-500" />,
  },
  updates: {
    description: "Acompanhe as entradas e saídas de membros da equipe.",
    icon: <Megaphone className="h-8 w-8 text-green-500" />,
  },
};

async function getCategories(): Promise<ApiCategory[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

export default async function TopicsIndexPage() {
  const apiCategories = await getCategories();

  const categories: UiCategory[] = apiCategories.map((category) => {
    const details = categoryDetailsMap[category.slug] || {
      description: "Uma nova categoria para explorar.",
      icon: <HelpCircle className="h-8 w-8" />,
    };

    return {
      href: `/topics/${category.slug}`,
      title: category.name,
      description: details.description,
      icon: details.icon,
    };
  });

  return (
    <div className="min-h-screen font-sans p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Fóruns</h1>
          <p className="text-lg">
            Navegue pelas categorias para encontrar o que procura.
          </p>
        </div>
        <div className="mb-6">
          <Button
            className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Início
            </Link>
          </Button>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link href={category.href} key={category.href} className="group">
                <Card className="border border-slate-700 hover:border-blue-500 transition-all duration-300 h-full bg-slate-800 hover:bg-slate-700 text-white">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div>{category.icon}</div>
                    <div>
                      <CardTitle className="group-hover:text-blue-400 transition-colors">
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
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-700 dark:text-gray-500">
              Nenhuma categoria encontrada no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
