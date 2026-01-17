import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fóruns",
  description: "Navegue e participe das discussões da comunidade Auditore.",
};

export default function TopicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <>{children}</>;
}