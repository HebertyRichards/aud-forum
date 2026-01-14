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
import type { UserWithProfile } from "@/types/autentication";
import { X } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

type ProfileCardProps = {
  user: UserWithProfile;
  onClose: () => void;
};

export function ProfileCard({ user, onClose }: ProfileCardProps) {
  const [username, setUsername] = useState(user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");

  const { mutate, isPending } = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      username,
      newEmail: email,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="text-white w-full max-w-md bg-slate-800 border-slate-700 relative animate-in fade-in-0 zoom-in-95">
        <CardHeader>
          <CardTitle>Alterar Perfil</CardTitle>
          <CardDescription>
            Para alterar seu e-mail, um link de confirmação será enviado para o
            novo endereço.
          </CardDescription>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-opacity"
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
                className="w-full bg-slate-700 border-slate-600"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 border-slate-600"
                disabled={isPending}
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              type="submit"
              className="bg-blue-500 border border-blue-400 hover:bg-blue-400"
              disabled={isPending}
            >
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button
              type="button"
              className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
