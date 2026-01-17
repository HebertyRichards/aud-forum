import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirmação",
  robots: {
    index: false,
    follow: false,
  }
};

export default function SuccessRegisterRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
