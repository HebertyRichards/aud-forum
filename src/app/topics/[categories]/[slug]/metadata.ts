import type { Metadata } from "next";
import { getTopicBySlug } from "@/app/api/endpoints/topic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const topic = await getTopicBySlug(resolvedParams.slug);
    if (!topic) {
      return { title: "Auditore Family - Tópico Não Encontrado" };
    }
    const pageDescription = topic.content
      .replace(/<[^>]*>/g, "")
      .substring(0, 160);
    return {
      title: `Auditore Family - ${topic.title}`,
      description: pageDescription,
    };
  } catch {
    return {
      title: "Auditore Family - Erro ao Carregar",
    };
  }
}
