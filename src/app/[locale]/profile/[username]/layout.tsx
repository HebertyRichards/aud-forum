import type { ReactNode } from "react";
import { generateMetadata } from "./metadata";

export { generateMetadata };

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;
  void resolvedParams.username;

  return <>{children}</>;
}
