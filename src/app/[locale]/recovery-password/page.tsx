import type { Metadata } from "next";
import { getRecoveryPasswordMetadata } from "@/services/metadataService";
import RecoveryPasswordPageClient from "./RecoveryPasswordPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getRecoveryPasswordMetadata();
}

export default async function RecoveryPassword() {
  return <RecoveryPasswordPageClient />;
}
