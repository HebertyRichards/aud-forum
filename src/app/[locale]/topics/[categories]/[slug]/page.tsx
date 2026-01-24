import type { Metadata } from "next";
import { generateTopicMetadata } from "@/services/metadataService";
import TopicPageClient from "./TopicPageClient";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateTopicMetadata(slug);
}

export default async function TopicPage() {
  return <TopicPageClient />;
}