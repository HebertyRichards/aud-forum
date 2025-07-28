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
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      console.error("Erro de autenticação. Contexto não disponível.");
      return;
    }

    if (!username || !email || !password) {
      console.error("Tentativa de registro com campos vazios.");
      return;
    }

    setSuccess(null);
    setLoading(true);

    try {
      await auth.register(username, email, password);
      setSuccess("Conta criada com sucesso! Redirecionando para o login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error(
        "Falha no registro:",
        error.message || "Ocorreu um erro ao criar a conta."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle>Crie a sua Conta</CardTitle>
          <CardDescription>
            Digite seu Nick, e-mail e senha para criar a sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Digite seu nome de usuário"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="usuario@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {success && (
                <p className="text-sm text-green-500 text-center">{success}</p>
              )}
            </div>
            <CardFooter className="flex flex-col gap-4 pt-6 px-0 pb-0">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
              <Button variant="link" asChild>
                <Link href="/login">Já tem uma conta? Faça login</Link>
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
