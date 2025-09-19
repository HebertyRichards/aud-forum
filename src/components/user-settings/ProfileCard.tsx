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
import { X } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 relative animate-in fade-in-0 zoom-in-95">
        <CardHeader>
          <CardTitle>Alterar Perfil</CardTitle>
          <CardDescription>
            Para alterar seu e-mail, um link de confirmação será enviado para o
            novo endereço.
          </CardDescription>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-opacity"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
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
