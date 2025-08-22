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

interface PasswordCardProps {
  onClose: () => void;
}

export function PasswordCard({ onClose }: PasswordCardProps) {
  // NOVO
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Senha alterada com sucesso!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Falha ao alterar a senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>
            Altere sua senha aqui. Recomendamos usar uma senha forte.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Alterando..." : "Alterar Senha"}
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
