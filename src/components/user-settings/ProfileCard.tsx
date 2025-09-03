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
import axios from "axios";

interface ProfileCardProps {
  user: UserWithProfile;
  onClose: () => void;
}

export function ProfileCard({ user, onClose }: ProfileCardProps) {
  const [username, setUsername] = useState(user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await axios.patch(
        `/api/auth/update-user`,
        { username, newEmail: email },
        { withCredentials: true }
      );

      toast.success("Perfil atualizado com sucesso!");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: unknown) {
      let errorMessage = "Falha ao atualizar o perfil.";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Alterar Perfil</CardTitle>
          <CardDescription>
            Para alterar seu e-mail, um link de confirmação será enviado para o
            novo endereço.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="max-w-sm"
            />
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-sm"
            />
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
