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
      router.push("/login");
    }
  }, [auth.loading, user, router]);

  if (auth.loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">Verificando sessão...</p>
      </div>
    );
  }

  if (activeForm === "profile") {
    return <ProfileCard user={user} onClose={() => setActiveForm(null)} />;
  }
  if (activeForm === "password") {
    return <PasswordCard onClose={() => setActiveForm(null)} />;
  }

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

        <Card>
          <CardHeader>
            <CardTitle>Perfil e Senha</CardTitle>
            <CardDescription>
              Atualize suas informações de perfil ou altere sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nome de Usuário</p>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {user.email ?? "N/A"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveForm("profile")}
              >
                Alterar Perfil
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Senha</p>
                <p className="text-sm text-muted-foreground">********</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveForm("password")}
              >
                Alterar Senha
              </Button>
            </div>
          </CardContent>
        </Card>
        <DangerZoneCard />
      </div>
    </>
  );
}
