import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registra-se",
  description: "Crie sua conta e venha fazer parte dessa comunidade",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
