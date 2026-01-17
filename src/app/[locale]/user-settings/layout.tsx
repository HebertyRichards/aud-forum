import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
