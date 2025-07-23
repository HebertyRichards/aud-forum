"use client";

import { useState } from "react";
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
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm bg-white dark:bg-gray-800">
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
                  id="name"
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  placeholder="Digite o seu nick"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/recovery-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="keep-logged-in"
                  checked={keepLoggedIn}
                  onCheckedChange={(checked) => setKeepLoggedIn(!!checked)}
                />
                <Label
                  htmlFor="keep-logged-in"
                  className="text-sm font-medium leading-none"
                >
                  Mantenha-me conectado
                </Label>
              </div>
            </div>
            <CardFooter className="flex flex-col gap-4 pt-6 px-0 pb-0">
              <Button type="submit" className="w-full cursor-pointer">
                Entrar
              </Button>
              <Button variant="link" asChild>
                <Link href="/register">Não tem uma conta? Registre-se</Link>
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
