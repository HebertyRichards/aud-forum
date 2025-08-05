"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function NewPasswordForm() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaSenha || !confirmacaoSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmacaoSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    setErro("");
    console.log("Senha redefinida:", novaSenha);
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
              className="absolute right-2 top-2 text-muted-foreground"
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
            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            <Button type="submit" className="w-full">
              Atualizar senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
