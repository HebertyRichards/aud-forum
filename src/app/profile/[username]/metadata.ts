import type { Metadata } from "next";

export async function generateMetadata({
  params,
  
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/user/${username}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return {
        title: "Auditore Family - Perfil não encontrado",
        description: "Usuário não encontrado na Auditore Family.",
        robots: {
          index: false,
          follow: false,
        }
      };
    }

    const data = (await res.json()) as { username: string };

    return {
      title: `Auditore Family - perfil de ${data.username}`,
      description: `Veja informações, conquistas e atividades de ${data.username} na comunidade Auditore Family.`,      robots: {
        index: false,
        follow: false,
      }
    };
  } catch {
    return {
      title: "Auditore Family - Erro ao carregar",
      description: "Não foi possível carregar as informações do perfil.",
      robots: {
        index: false,
        follow: false,
      }
    };
  }
}
