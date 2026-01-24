import type { Metadata } from "next";
import { getConfirmationMetadata } from "@/services/metadataService";
import ConfirmationPageClient from "./ConfirmationPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getConfirmationMetadata();
}

export default async function SuccessRegister() {
  return <ConfirmationPageClient />;
}
