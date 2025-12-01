"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SuccessRegister() {
  const [countdown, setCountdown] = useState(7);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md w-full bg-slate-800 text-white border-slate-700">
        <CardHeader className="text-center">
          <CardTitle>Conta criada com sucesso!</CardTitle>
          <CardDescription>
            Você será redirecionado para a página de login em {countdown}{" "}
            segundo{countdown !== 1 ? "s" : ""}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-300">
            Obrigado por se registrar! Seja Bem-Vindo ao Fórum da Auditore
            Family.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
