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
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DangerZoneCard() {
  const [step, setStep] = useState<"initial" | "confirmPassword">("initial");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setStep("initial");
        setPassword("");
      }, 200);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Por favor, digite sua senha para confirmar.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Falha ao deletar a conta.");
      }

      toast.success("Conta deletada com sucesso. Você será redirecionado.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-red-500/50">
      <CardHeader>
        <CardTitle className="text-red-700 dark:text-red-500">
          Zona de Perigo
        </CardTitle>
        <CardDescription>
          Ações irreversíveis. Tenha certeza antes de prosseguir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Deletar Conta</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso irá deletar
                permanentemente sua conta e remover seus dados de nossos
                servidores.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {step === "confirmPassword" && (
              <div className="my-4 space-y-2">
                <Label htmlFor="password-confirm">
                  Para confirmar, digite sua senha:
                </Label>
                <Input
                  id="password-confirm"
                  type="password"
                  placeholder="Sua senha..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              {step === "initial" ? (
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep("confirmPassword");
                  }}
                >
                  Sim, quero deletar
                </AlertDialogAction>
              ) : (
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading ? "Excluindo..." : "Confirmar Exclusão"}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
