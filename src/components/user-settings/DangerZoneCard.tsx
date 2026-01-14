"use client";

import { useState, useEffectEvent } from "react";
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
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

export function DangerZoneCard() {
  const [step, setStep] = useState<"initial" | "confirmPassword">("initial");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useDeleteAccount();

  const handleOpenChange = useEffectEvent((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStep("initial");
      setPassword("");
    }
  });

  const handleConfirmDelete = () => {
    if (!password) {
      toast.error("Por favor, digite sua senha para confirmar.");
      return;
    }
    mutate(password);
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
          <AlertDialogContent className="bg-slate-800 text-white border border-slate-700">
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
                  disabled={isPending}
                  className="bg-slate-700 border border-slate-600 text-white"
                />
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-slate-700 border border-slate-600 hover:bg-slate-600 cursor-pointer"
                disabled={isPending}
              >
                Cancelar
              </AlertDialogCancel>

              {step === "initial" ? (
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
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
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                >
                  {isPending ? "Excluindo..." : "Confirmar Exclusão"}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
