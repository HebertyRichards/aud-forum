import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regras",
  description: "Regras para os membros da Família Auditore",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RulesRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
