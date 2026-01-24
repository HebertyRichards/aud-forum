import type { Metadata } from "next";
import { getOwnProfileMetadata } from "@/services/metadataService";
import ProfilePageClient from "@/app/[locale]/profile/ProfilePageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getOwnProfileMetadata();
}

export default async function ProfilePage() {
  return <ProfilePageClient />;
}
