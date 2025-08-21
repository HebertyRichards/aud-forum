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
import { Toaster, toast } from "sonner";

export default function SettingsPage() {
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Informações do perfil salvas!");
    toast.success("Perfil atualizado com sucesso!");
  };
  const handleDeleteAccount = () => {
    console.log("Conta deletada!");
    toast.error("Sua conta foi excluída permanentemente.");
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />

      <div className="flex-1 space-y-8 p-8 pt-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta e preferências.
          </p>
        </div>
        <Card className="mt-4 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Estas informações serão exibidas publicamente no seu perfil.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  defaultValue="HebertyRichards"
                  className="max-w-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="hebertyrichards@gmail.com"
                  className="max-w-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4">
              <Button type="submit">Salvar Alterações</Button>
            </CardFooter>
          </form>
        </Card>
        <Card className="border-red-500/50 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-500">
              Zona de Perigo
            </CardTitle>
            <CardDescription>
              Ações irreversíveis. Tenha certeza antes de prosseguir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog onOpenChange={setShowPasswordInput.bind(null, false)}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Deletar Conta</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você tem certeza absoluta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá deletar
                    permanentemente sua conta e remover seus dados de nossos
                    servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {showPasswordInput && (
                  <div className="my-4 space-y-2">
                    <Label htmlFor="password-confirm">
                      Para confirmar, digite sua senha:
                    </Label>
                    <Input
                      id="password-confirm"
                      type="password"
                      placeholder="Sua senha..."
                    />
                  </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  {!showPasswordInput ? (
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPasswordInput(true);
                      }}
                    >
                      Sim, quero deletar
                    </AlertDialogAction>
                  ) : (
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDeleteAccount}
                    >
                      Confirmar Exclusão
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
