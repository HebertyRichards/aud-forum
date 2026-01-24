import type { Metadata } from "next";
import { getVerificationMetadata } from "@/services/metadataService";
import VerificationPageClient from "./VerificationPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getVerificationMetadata();
}

export default async function VerificationPage() {
  return <VerificationPageClient />;
}
