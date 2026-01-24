import type { Metadata } from "next";
import { API_URL } from "@/utils/forum-structure";
import { getTranslations } from "next-intl/server";

export type PageMetadataConfig = {
  title: string;
  description: string;
  robots?: {
    index: boolean;
    follow: boolean;
  };
};



function formatSlugAsTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
};

const ERROR_ROBOTS = {
  index: false,
  follow: false,
};

export const staticMetadata = {
  profile: {
    own: {
      title: "Meu perfil",
      description:
        "Gerencie suas informações, configurações e atividades na comunidade Auditore Family.",
    },
    notFound: {
      title: "Perfil não encontrado",
      description: "Usuário não encontrado na Auditore Family.",
      robots: ERROR_ROBOTS,
    },
    error: {
      title: "Erro ao carregar",
      description: "Não foi possível carregar as informações do perfil.",
      robots: ERROR_ROBOTS,
    },
  },
  verification: {
    title: "Verificação",
    description: "Verifique sua conta na comunidade Auditore Family.",
    robots: ERROR_ROBOTS,
  },
  userSettings: {
    title: "Configurações",
    description: "Gerencie suas configurações de conta na Auditore Family.",
    robots: ERROR_ROBOTS,
  },
  members: {
    title: "Lista de Membros",
    description: "Veja todos os membros da comunidade Auditore Family.",
  },
  about: {
    title: "Sobre",
    description: "Conheça a história da Auditore Family.",
  },
  rules: {
    title: "Regras",
    description: "Leia as regras da comunidade Auditore Family.",
  },
  confirmation: {
    title: "Confirmação",
    description: "Confirme sua ação na comunidade Auditore Family.",
    robots: ERROR_ROBOTS,
  },
  recoveryPassword: {
    title: "Recuperar senha",
    description: "Recupere sua senha na comunidade Auditore Family.",
    robots: ERROR_ROBOTS,
  },
  resetPassword: {
    title: "Redefinir senha",
    description: "Redefina sua senha na comunidade Auditore Family.",
    robots: ERROR_ROBOTS,
  },
  topicsIndex: {
    title: "Fóruns",
    description: "Explore as categorias e tópicos da comunidade Auditore Family.",
  },
  root: {
    title: {
      default: "Auditore Family",
      template: "Auditore Family - %s",
    },
    description:
      "Fórum da Família Auditore, venha conhecer a nossa comunidade e nossa família",
    openGraph: {
      title: "Auditore Family",
      description:
        "Fórum da Família Auditore, venha conhecer a nossa comunidade e nossa família",
      siteName: "Auditore Family",
    },
    keywords: [
      "Auditore",
      "Auditore Samp",
      "gta samp",
      "brasil play shox",
      "aizen auditore",
      "krauzim auditore",
      "auditore family",
    ],
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
    category: "gaming",
  },
} as const;

export async function generateUserProfileMetadata(
  username: string
): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/profile/user/${username}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return staticMetadata.profile.notFound;
    }

    const data = (await res.json()) as { username: string };

    return {
      title: `Perfil de ${data.username}`,
      description: `Veja informações, conquistas e atividades de ${data.username} na comunidade Auditore Family.`,
      robots: ERROR_ROBOTS,
    };
  } catch {
    return staticMetadata.profile.error;
  }
}

export async function generateCategoryMetadata(
  categorySlug: string
): Promise<Metadata> {
  const t = await getTranslations("categories");

  const categoryName = t.has(categorySlug) 
    ? t(categorySlug) 
    : formatSlugAsTitle(categorySlug);

  return {
    title: `${categoryName}`,
    description: "Crie um tópico e interaja com a comunidade!",
  };
}

export async function generateTopicMetadata(slug: string): Promise<Metadata> {
  const title = formatSlugAsTitle(slug);

  return {
    title: `${title}`,
    description: "Leia e participe da discussão neste tópico.",
  };
}

export function createUserProfileMetadataGenerator() {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ username: string }>;
  }): Promise<Metadata> {
    const resolvedParams = await params;
    return generateUserProfileMetadata(resolvedParams.username);
  };
}

export function createStaticMetadata(config: PageMetadataConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    robots: config.robots ?? DEFAULT_ROBOTS,
  };
}

export function getOwnProfileMetadata(): Metadata {
  return createStaticMetadata(staticMetadata.profile.own);
}

export function getTopicsIndexMetadata(): Metadata {
  return createStaticMetadata(staticMetadata.topicsIndex);
}

export function getRootMetadata(): Metadata {
  const config = staticMetadata.root;
  return {
    title: config.title,
    description: config.description,
    openGraph: config.openGraph,
    keywords: [...config.keywords],
    icons: config.icons,
    category: config.category,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export const getAboutMetadata = () => createStaticMetadata(staticMetadata.about);
export const getVerificationMetadata = () => createStaticMetadata(staticMetadata.verification);
export const getUserSettingsMetadata = () => createStaticMetadata(staticMetadata.userSettings);
export const getMembersMetadata = () => createStaticMetadata(staticMetadata.members);
export const getRulesMetadata = () => createStaticMetadata(staticMetadata.rules);
export const getConfirmationMetadata = () => createStaticMetadata(staticMetadata.confirmation);
export const getRecoveryPasswordMetadata = () => createStaticMetadata(staticMetadata.recoveryPassword);
export const getResetPasswordMetadata = () => createStaticMetadata(staticMetadata.resetPassword);
