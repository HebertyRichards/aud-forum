import type { Metadata } from "next";

import { getMembersMetadata } from "@/services/metadataService";

export const metadata: Metadata = getMembersMetadata();

export default function MembersListRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
