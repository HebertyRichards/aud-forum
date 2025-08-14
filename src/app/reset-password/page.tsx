"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/services/auth";

export default function NewPasswordForm() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");

    if (token) {
      setAccessToken(token);
    } else {
      setError(
        "Token de recuperação não encontrado na URL. Por favor, use o link enviado para o seu e-mail."
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Erro de autenticação. Tente recarregar a página.");
      return;
    }

    if (!accessToken) {
      setError(
        "Token de recuperação inválido. Por favor, solicite um novo link."
      );
      return;
    }

    if (!novaSenha || !confirmacaoSenha) {
      setError("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmacaoSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await auth.updatePassword(novaSenha, accessToken);
      setSucesso(
        "Senha atualizada com sucesso! Redirecionando para o login..."
      );
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setError("Ocorreu uma falha inesperada");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center">Redefinir senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label htmlFor="novaSenha">Nova senha</Label>
            <Input
              id="novaSenha"
              type={mostrarSenha ? "text" : "password"}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-2 top-8 text-muted-foreground"
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <Label htmlFor="confirmarSenha">Confirmar senha</Label>
            <Input
              id="confirmarSenha"
              type="password"
              value={confirmacaoSenha}
              onChange={(e) => setConfirmacaoSenha(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {sucesso && <p className="text-green-600 text-sm">{sucesso}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !accessToken}
            >
              {loading ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
