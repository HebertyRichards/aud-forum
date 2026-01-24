import type { Metadata } from "next";
import { getMembersMetadata } from "@/services/metadataService";
import MembersListPageClient from "./MembersListPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getMembersMetadata();
}

export default async function MembersList() {
  return <MembersListPageClient />;
}
