import type { Metadata } from "next";

import { getResetPasswordMetadata } from "@/services/metadataService";

export const metadata: Metadata = getResetPasswordMetadata();

export default function NewPassowordRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
