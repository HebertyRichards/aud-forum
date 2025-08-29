import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova Senha",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewPassowordRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
