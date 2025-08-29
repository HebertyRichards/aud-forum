import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Meu perfil",
  description:
    "Gerencie suas informações, configurações e atividades na comunidade Auditore Family.",
};

export default function ProfileRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster richColors />
    </>
  );
}
