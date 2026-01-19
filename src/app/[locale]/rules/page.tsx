"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { RolesAuthorizedSchema } from "@/schema/user";
import { useFetchUserProfile } from "@/hooks/useFetchUserProfile";

export default function Rules() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["userProfilePermission", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      return useFetchUserProfile(user.id);
    },
    enabled: !!user?.id,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const userRole = profileData?.data?.profile?.role;
  const hasPermission = userRole
    ? RolesAuthorizedSchema.safeParse(userRole).success
    : false;

  useEffect(() => {
    if (authLoading || isProfileLoading) {
      return;
    }

    if (!user || isProfileError || (profileData && !hasPermission)) {
      router.push("/not-found");
    }
  }, [
    authLoading,
    isProfileLoading,
    user,
    profileData,
    hasPermission,
    isProfileError,
    router,
  ]);

  if (authLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">Verificando permissões...</p>
      </div>
    );
  }

  if (hasPermission) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl text-white">
        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-center items-center gap-x-4 mb-6">
            <Image
              src="/header.png"
              alt="Header Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold text-center">
              REGRAS E INFORMAÇÕES
            </h1>
            <Image
              src="/header.png"
              alt="Header Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </div>
          <ol
            className="list-decimal list-inside space-y-4 text-gray-400 text-justify 
                       marker:font-bold marker:text-white"
          >
            <li>{`Prezamos pelo mínimo de lealdade.`}</li>
            <li>
              {`Não fale sobre os assuntos da Auditore com gente de fora. Meio
              óbvio, né? Não divulgue o que acontece internamente com gente de
              fora.`}
            </li>
            <li>
              {`Evite brigas internas. Caso algo te incomode, procure um dos
              responsáveis da Auditore pra resolver no privado.`}
            </li>
            <li>
              {`O que acontece no nosso grupo do WhatsApp e Discord, fica no nosso
              grupo. Não fique espalhando as coisas que falamos e compartilhamos
              por aí (isso vale pra tudo, figurinhas, links e outras coisas
              menos importantes).`}
            </li>
            <li>
              {`Não panelar errado. Usamos bastante esse termo pra quando alguém
              está prestes a fazer ou falar uma besteira grande. Se você sabe
              que fazer algo vai prejudicá-lo(a), não faça. Depois não adianta
              ficar chorando porque foi banido e querendo pagar de certo. Se
              você fez besteira, assuma seu B.O e pronto, vida que segue.`}
            </li>
            <li>
              {`Não permitimos que a Auditore (SA:MP) tenha 2 líderes de
              organizações ao mesmo tempo; apenas um por vez é permitido.
              Lembre-se: sempre avise antes de assumir a liderança, pois aqui
              não é bagunça.`}
            </li>
            <li>
              {`É proibido qualquer ato que prejudique a Auditore e seus membros.
              Exemplos: conspirar contra e deixar o grupo em segundo plano. Se
              você entrou no jogo e viu que a Auditore está de Grove, cole de
              Grove. Porra, a gente dando a vida na guerra de Grove e você cola
              de Vagos? E o bom senso? Isso é atitude de gente desunida. Não
              quero esse tipo de coisa acontecendo por aqui.`}
            </li>
            <li>
              {`Todos têm o direito de expressar suas opiniões, desde que de forma
              respeitosa, sem rebaixar ou humilhar ninguém. Sugestões são sempre
              bem-vindas.`}
            </li>
            <li>
              {`Recrutamos apenas pessoas que acreditamos ter o perfil da
              Auditore; colar junto não é suficiente. Essa análise será feita
              pelos responsáveis.`}
            </li>
            <li>
              {`Se por algum motivo você deseja sair da Auditore, procure o
              responsável no privado e fale a verdade. Diga: 'Olha, eu estou
              saindo da Auditore por esse motivo' ou simplesmente nem precisa
              falar o motivo, só diga: "Estou saindo da família por motivos
              pessoais, obrigado pela oportunidade". Só não fique inventando
              desculpinhas pra sair, porque isso fica muito na cara e vai ficar
              feio pra você. Se for sair, saia de cabeça erquida, sem mentiras
              ou tretas com ninguém.`}
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return null;
}
