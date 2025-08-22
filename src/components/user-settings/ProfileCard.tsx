"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import type { UserWithProfile } from "@/types/autentication";

interface ProfileCardProps {
  user: UserWithProfile;
  onClose: () => void;
}

export function ProfileCard({ user, onClose }: ProfileCardProps) {
  const [username, setUsername] = useState(user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newEmail: email }),
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Perfil atualizado com sucesso!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Falha ao atualizar o perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Alterar Perfil</CardTitle>
          <CardDescription>
            Para alterar seu e-mail, um link de confirmação será enviado para o
            novo endereço.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
