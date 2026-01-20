import type { Metadata } from "next";

const categoryTitleMap: Record<string, string> = {
  downloads: "Downloads",
  manuals: "Manuais",
  "general-discussions": "Discussões Gerais",
  members: "Área dos Membros",
  subscribes: "Inscrições",
  updates: "Atualizações",
};

function formatSlugAsTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type Props = {
  params: Promise<{ categories: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categories: categorySlug } = await params;

  const categoryName =
    categoryTitleMap[categorySlug] || formatSlugAsTitle(categorySlug);

  return {
    title: `Auditore Family - ${categoryName}`,
    description: "Crie um tópico e interaja com a comunidade!",
  };
}