import type { Metadata } from "next";
import { generateCategoryMetadata } from "@/services/metadataService";
import CategoryTopicPageClient from "./CategoryTopicPageClient";

interface Props {
  params: Promise<{
    categories: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categories } = await params;
  return generateCategoryMetadata(categories);
}

export default async function CategoryTopicPage() {
  return <CategoryTopicPageClient />;
}