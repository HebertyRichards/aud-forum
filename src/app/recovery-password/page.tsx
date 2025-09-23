"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/services/auth";

export default function RecoveryPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email.trim());
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Erro de autenticação. Tente recarregar a página.");
      return;
    }

    if (!email || !isValidEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    setError("");
    setSucesso("");
    setLoading(true);

    try {
      await auth.forgotPassword(email.trim());
      setSucesso("Enviamos a alteração para o seu email, confira!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu uma falha inesperada");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-gray-700 text-gray-300 bg-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              Esqueceu sua senha?
            </CardTitle>
            <CardDescription className="pt-2">
              Sem problemas. Digite seu e-mail abaixo e enviaremos um link para
              você criar uma nova senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 "
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {sucesso && <p className="text-green-500 text-sm">{sucesso}</p>}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-slate-700 border border-slate-600 hover:bg-slate-600"
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
            <Button variant="link" asChild>
              <Link href="/login" className="text-white hover:text-blue-300">
                Voltar para o login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
