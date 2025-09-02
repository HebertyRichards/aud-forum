import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história da Auditore Family.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
