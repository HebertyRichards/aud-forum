import type { Metadata } from "next";
import { getResetPasswordMetadata } from "@/services/metadataService";
import NewPasswordPageClient from "./ResetPasswordPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getResetPasswordMetadata();
}

export default async function NewPasswordForm() {
  return <NewPasswordPageClient />;
}
