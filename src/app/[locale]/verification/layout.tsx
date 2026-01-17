import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificação no Email",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerificationRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
