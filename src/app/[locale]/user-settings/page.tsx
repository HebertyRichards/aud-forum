import type { Metadata } from "next";
import { getUserSettingsMetadata } from "@/services/metadataService";
import UserSettingsPageClient from "./UserSettingsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getUserSettingsMetadata();
}

export default async function SettingsPage() {
  return <UserSettingsPageClient />;
}
