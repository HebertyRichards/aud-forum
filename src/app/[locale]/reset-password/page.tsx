"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/providers/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function NewPasswordForm() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("pages.resetPassword");
  const tAuth = useTranslations("auth");

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");

    if (token) {
      setAccessToken(token);
    } else {
      toast.error(t("tokenNotFound"));
    }
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast.error(t("tokenInvalid"));
      return;
    }

    if (!accessToken) {
      toast.error(t("tokenInvalid"));
      return;
    }

    if (!novaSenha || !confirmacaoSenha) {
      toast.error(t("fillAllFields"));
      return;
    }

    if (novaSenha !== confirmacaoSenha) {
      toast.error(tAuth("passwordsNotMatch"));
      return;
    }
    setLoading(true);

    try {
      await auth.updatePassword(novaSenha, accessToken);
      toast.success(t("passwordUpdated"));
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("tokenInvalid"));
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-center">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label htmlFor="novaSenha">{t("newPassword")}</Label>
            <Input
              id="novaSenha"
              type={mostrarSenha ? "text" : "password"}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-2 top-8 text-muted-foreground"
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <Label htmlFor="confirmarSenha">{t("confirmPassword")}</Label>
            <Input
              id="confirmarSenha"
              type="password"
              value={confirmacaoSenha}
              onChange={(e) => setConfirmacaoSenha(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
            <Button
              type="submit"
              className="w-full mt-4 border border-slate-600 bg-slate-700 hover:bg-slate-600"
              disabled={loading || !accessToken}
            >
              {loading ? t("updating") : t("updatePassword")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
