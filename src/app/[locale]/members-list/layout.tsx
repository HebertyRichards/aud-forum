import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membros da Comunidade",
  description:
    "Veja a lista de membros da Auditore Family e descubra quem faz parte da nossa comunidade gamer e de modding.",
};

export default function MembersListRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
