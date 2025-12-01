"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { ProfileCard } from "@/components/user-settings/ProfileCard";
import { PasswordCard } from "@/components/user-settings/PasswordCard";
import { DangerZoneCard } from "@/components/user-settings/DangerZoneCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();

  const [activeForm, setActiveForm] = useState<"profile" | "password" | null>(
    null
  );

  useEffect(() => {
    if (!auth.loading && !user) {
      router.push("/");
    }
  }, [auth.loading, user, router]);

  if (auth.loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Verificando sessão...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      {activeForm === "profile" ? (
        <ProfileCard user={user} onClose={() => setActiveForm(null)} />
      ) : activeForm === "password" ? (
        <PasswordCard onClose={() => setActiveForm(null)} />
      ) : (
        <div className="flex-1 space-y-8 p-8 pt-6 text-white">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
            <p className="text-muted-foreground">
              Gerencie as configurações da sua conta e preferências.
            </p>
          </div>
          <Card className="bg-slate-800 text-white border-slate-700">
            <CardHeader>
              <CardTitle>Perfil e Senha</CardTitle>
              <CardDescription>
                Atualize suas informações de perfil ou altere sua senha.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium">Nome de Usuário</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.username}
                  </p>
                </div>
              </div>
              <Separator className="bg-slate-600" />
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email ?? "N/A"}
                  </p>
                </div>
                <Button
                  className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
                  onClick={() => setActiveForm("profile")}
                >
                  Alterar Perfil
                </Button>
              </div>
              <Separator className="bg-slate-600" />
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium">Senha</p>
                  <p className="text-sm text-muted-foreground">********</p>
                </div>
                <Button
                  className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
                  onClick={() => setActiveForm("password")}
                >
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
          <DangerZoneCard />
        </div>
      )}
    </>
  );
}
