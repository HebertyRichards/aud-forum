import type { Metadata } from "next";

import { getRecoveryPasswordMetadata } from "@/services/metadataService";

export const metadata: Metadata = getRecoveryPasswordMetadata();

export default function RecoveryPassowordRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
