import type { ReactNode } from "react";
import { generateMetadata } from "./metadata";

export { generateMetadata };

export default async function TopicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  await params;

  return <>{children}</>;
}