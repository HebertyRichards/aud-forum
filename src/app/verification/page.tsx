import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function VerificationEmail() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <MailCheck className="w-10 h-10 text-primary" />
          <CardTitle className="text-2xl font-semibold">
            Confirme seu e-mail
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Enviamos um link de confirmação para o seu e-mail. Verifique sua
            caixa de entrada e clique no link para ativar sua conta.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
