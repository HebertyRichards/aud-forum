"use client";

import Link from "next/link";
import { useAuth } from "@/services/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useRouter } from "next/navigation";

export function HeaderDesktop() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.logout();
    }
    router.push("/login");
  };

  const getUsername = () => {
    if (!auth?.user) return "";
    return auth.user.username || auth.user.email?.split("@")[0];
  };
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
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-xs lg:text-sm"
            >
              Início
            </Link>
            <Link
              href="/members-list"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-xs lg:text-sm"
            >
              Membros
            </Link>
            <Link
              href="/subscribe"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-xs lg:text-sm"
            >
              Inscreva-se
            </Link>
            <Link
              href="/downloads"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-xs lg:text-sm"
            >
              Downloads
            </Link>
            {/* se estiver logado aparece regras e for membro / dono*/}
            <Link
              href="/rules"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-xs lg:text-sm"
            >
              Regras
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            {auth?.loading ? (
              <div className="h-8 md:h-9 w-32 md:w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            ) : auth?.user ? (
              <>
                <Link
                  href="/profile"
                  className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline"
                >
                  Olá, {getUsername()}
                </Link>
                <Button
                  variant="outline"
                  className="h-8 px-2 text-xs lg:h-9 lg:px-3 lg:text-sm"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "outline",
                    className: "h-8 px-2 text-xs lg:h-9 lg:px-3 lg:text-sm",
                  })}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({
                    className: "h-8 px-2 text-xs lg:h-9 lg:px-4 lg:text-sm",
                  })}
                >
                  Registrar
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
