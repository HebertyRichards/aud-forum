"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/services/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function HeaderDesktop() {
  const auth = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userId = auth.user?.id;
    if (!userId) {
      setUserRole(null);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/${userId}`);
        if (res.ok) {
          const profileData = await res.json();
          setUserRole(profileData.role);
        } else {
          setUserRole(null);
        }
      } catch {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [auth.user?.id]);

  const allowedRoles = ["Fundador", "Leader", "Membro", "Desenvolvedor"];
  const canViewRules = userRole && allowedRoles.includes(userRole);

  const handleLogout = async () => {
    await auth.logout();
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
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/header.png"
                alt="Header Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 items-center">
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
            {canViewRules && (
              <Link
                href="/rules"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors text-xs lg:text-sm"
              >
                Regras
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-3">
            {auth?.loading ? (
              <div className="h-9 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            ) : auth?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={auth.user.avatar_url || ""}
                        alt={getUsername()}
                      />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getUsername()}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {auth.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      Meu Perfil
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/user-settings">
                    <DropdownMenuItem className="cursor-pointer">
                      Configurações
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
