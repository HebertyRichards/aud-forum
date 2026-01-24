import type { Metadata } from "next";
import { getRulesMetadata } from "@/services/metadataService";
import RulesPageClient from "./RulesPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getRulesMetadata();
}

export default async function RulesPage() {
  return <RulesPageClient />;
}
