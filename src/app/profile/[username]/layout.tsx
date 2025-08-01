import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/user/${username}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Usuário não encontrado");
    }

    const data = await res.json();

    return {
      title: `Auditore Family - perfil de ${data.username}`,
      description: `Perfil de ${data.username} na Auditore Family.`,
    };
  } catch (error) {
    return {
      title: "Perfil não encontrado",
      description: "O perfil solicitado não existe.",
    };
  }
}

export default function OtherProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
