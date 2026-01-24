import type { Metadata } from "next";

import { getAboutMetadata } from "@/services/metadataService";

export const metadata: Metadata = getAboutMetadata();

export default function AboutRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
