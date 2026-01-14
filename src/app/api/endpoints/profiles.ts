import { UserStats } from "@/schema/user";
import { TopicSummary } from "@/schema/forum";

type UpdateProfileData = {
  username: string;
  newEmail: string;
};

interface UpdateContactsPayload {
  id?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  discord?: string;
  steam?: string;
}

interface UpdateProfileDataPayload {
  id?: string;
  username?: string;
  gender?: string;
  birthdate?: string;
  location?: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  const res = await fetch(`/api/profile/update-data`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error("Falha ao atualizar o perfil.", {
      cause: errorData.error,
    });
  }
};

export const updatePassword = async (newPassword: string) => {
  const res = await fetch(`/api/auth/update-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error("Falha ao alterar a senha.", {
      cause: errorData.error,
    });
  }
};

export const deleteAccount = async (password: string) => {
  const res = await fetch(`/api/auth/delete-account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error("Falha ao deletar a conta.", {
      cause: errorData.error,
    });
  }
};

export const uploadAvatarApi = async (compressedFile: File) => {
  const formData = new FormData();
  formData.append("avatar", compressedFile);

  const res = await fetch(`/api/profile/user/avatar`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao atualizar o avatar.");
  }
  return res.json();
};

export const deleteAvatarApi = async () => {
  const res = await fetch(`/api/profile/user/avatar`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao remover o avatar.");
  }
  return res.json();
};

export const updateContactsApi = async (payload: UpdateContactsPayload) => {
  const res = await fetch(`/api/profile/update`, {
    method: "PUT",
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao atualizar os contatos.");
  }

  return res.json();
};

export const updateProfileDataApi = async (
  payload: UpdateProfileDataPayload
) => {
  const res = await fetch(`/api/profile/update`, {
    method: "PUT",
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Falha ao atualizar os dados do perfil."
    );
  }

  return res.json();
};

export async function getUserStatsApi(username: string): Promise<UserStats> {
  const response = await fetch(`/api/statistic/profile/${username}/stats`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar as estatísticas do usuário.");
  }
  return response.json();
}

export async function getTopicsByAuthorApi(
  username: string
): Promise<TopicSummary[]> {
  const response = await fetch(`/api/statistic/profile/${username}/topics`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar os tópicos do usuário.");
  }
  return response.json();
}
