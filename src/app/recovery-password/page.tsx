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

export default function RecoveryPassword() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-gray-700 text-gray-300 bg-white dark:bg-gray-800">
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
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="bg-[#1e1e2e] border-gray-600 text-white placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Enviar link de recuperação
            </Button>
            <Button variant="link" asChild>
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Voltar para o login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
