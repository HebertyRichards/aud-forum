import type { Metadata } from "next";

import { getConfirmationMetadata } from "@/services/metadataService";

export const metadata: Metadata = getConfirmationMetadata();

export default function SuccessRegisterRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
