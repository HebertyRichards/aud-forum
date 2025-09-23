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
import axios from "axios";

export function DangerZoneCard() {
  const [step, setStep] = useState<"initial" | "confirmPassword">("initial");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      await axios.delete(`/api/auth/delete-account`, {
        data: { password },
        withCredentials: true,
      });
      toast.success("Conta deletada com sucesso. Você será redirecionado.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = "Ocorreu uma falha desconhecida.";
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
    <Card className="border-slate-700 bg-slate-800 hover:border-red-500/50 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-red-500">Zona de Perigo</CardTitle>
        <CardDescription>
          Ações irreversíveis. Tenha certeza antes de prosseguir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Deletar Conta</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-800 text-white">
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
              <AlertDialogCancel className="bg-slate-600 border border-slate-700 cursor-poiner">
                Cancelar
              </AlertDialogCancel>
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
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/50"
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
