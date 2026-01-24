import type { Metadata } from "next";
import { generateUserProfileMetadata } from "@/services/metadataService";
import UsernamePageClient from "./UsernamePageClient";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return generateUserProfileMetadata(username);
}

export default async function UsernamePage() {
  return <UsernamePageClient />;
}
