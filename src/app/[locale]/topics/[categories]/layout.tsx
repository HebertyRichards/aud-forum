import type { ReactNode } from "react";
import { generateMetadata } from "./metadata";

export { generateMetadata };

export default async function CategoryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ categories: string }>;
}) {
  await params;

  return <>{children}</>;
}