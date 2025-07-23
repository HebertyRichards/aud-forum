import Link from "next/link";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { ModeToggle } from "../ModeToggle";

export function HeaderDestkop() {
  return (
    <header className="border-b shadow-sm bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold">Auditore</h1>
              <Badge variant="secondary" className="ml-2">
                Família
              </Badge>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm"
            >
              Início
            </Link>
            <Link
              href="/members-list"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm"
            >
              Membros
            </Link>
            <Link
              href="/subscribe"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm"
            >
              Inscreva-se
            </Link>
            <Link
              href="/downalods"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm"
            >
              Downloads
            </Link>
            {/* se estiver logado aparece regras e for membro / dono*/}
            <Link
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm"
            >
              Regras
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Entrar
            </Link>

            <Link href="/register" className={buttonVariants({ size: "sm" })}>
              Registrar
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
