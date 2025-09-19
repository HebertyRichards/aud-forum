"use client";

import { useState } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Erro de autenticação. Tente recarregar a página.");
      return;
    }
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await auth.login(email, password, keepLoggedIn);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu uma falha inesperada.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm bg-slate-800 border-slate-700 text-white">
        <CardHeader className="text-center">
          <CardTitle>Entre com a sua conta</CardTitle>
          <CardDescription>
            Digite seu e-mail e senha para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  placeholder="seu@email.com"
                  required
                  className="bg-slate-700 border-slate-600"
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/recovery-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="bg-slate-700 border-slate-600"
                  placeholder="********"
                  disabled={loading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="keep-logged-in"
                  checked={keepLoggedIn}
                  onCheckedChange={(checked) => setKeepLoggedIn(!!checked)}
                  disabled={loading}
                  className="border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400"
                />
                <Label
                  htmlFor="keep-logged-in"
                  className="text-sm font-medium leading-none"
                >
                  Mantenha-me conectado
                </Label>
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </div>
            <CardFooter className="flex flex-col gap-4 pt-6 px-0 pb-0">
              <Button
                type="submit"
                className="w-full bg-blue-500 border border-blue-400 hover:bg-blue-400"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <Button
                variant="link"
                className="text-white hover:text-blue-300"
                asChild
              >
                <Link href="/register">Não tem uma conta? Registre-se</Link>
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
