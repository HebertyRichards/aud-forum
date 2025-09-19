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
import axios from "axios";

interface PasswordCardProps {
  onClose: () => void;
}

export function PasswordCard({ onClose }: PasswordCardProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.patch(
        `/api/auth/update-password`,
        { newPassword },
        { withCredentials: true }
      );

      toast.success("Senha alterada com sucesso!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: unknown) {
      let errorMessage = "Falha ao alterar a senha.";
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
      <Card className="bg-slate-800 text-white border-slate-700">
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>
            Altere sua senha aqui. Recomendamos usar uma senha forte.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="max-w-sm bg-slate-700 border-slate-600"
            />
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="max-w-sm bg-slate-700 border-slate-600"
            />
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? "Alterando..." : "Alterar Senha"}
            </Button>
            <Button
              type="button"
              className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
