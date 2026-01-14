import { UserWithProfile } from "@/types/autentication";

export const authService = {
  async getSession(): Promise<UserWithProfile> {
    const res = await fetch(`/api/auth/session`, { credentials: "include" });
    if (!res.ok) throw new Error("Sessão inválida");
    return res.json();
  },

  async login(credentials: {
    email: string;
    password: string;
    keepLogged: boolean;
  }) {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro no login");
    }
    return res.json();
  },

  async register(data: { username: string; email: string; password: string }) {
    const res = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro no registro");
    }
    return res.json();
  },

  async logout() {
    const res = await fetch(`/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erro no logout");
  },

  async updatePassword(data: { newPassword: string; accessToken?: string }) {
    const res = await fetch(`/api/auth/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erro ao atualizar senha");
    return res.json();
  },

  async forgotPassword(email: string) {
    const res = await fetch(`/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Erro ao enviar recuperação");
    return res.json();
  },
};
