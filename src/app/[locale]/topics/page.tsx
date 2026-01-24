import type { Metadata } from "next";
import { getTopicsIndexMetadata } from "@/services/metadataService";
import TopicsIndexPageClient from "./TopicsIndexPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getTopicsIndexMetadata();
}

export default async function TopicsIndexPage() {
  return <TopicsIndexPageClient />;
}