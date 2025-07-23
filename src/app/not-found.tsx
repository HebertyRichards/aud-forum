import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Alert
        variant="destructive"
        className="max-w-lg w-full bg-white dark:bg-gray-800"
      >
        <AlertTitle className="text-2xl font-bold">
          Erro 404: Página Não Encontrada
        </AlertTitle>
        <AlertDescription className="mt-4">
          <p className="mb-4">
            Oops! O endereço que você está tentando acessar não existe ou foi
            removido.
          </p>
          <Button asChild>
            <Link href="/">Voltar para a Página Inicial</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
