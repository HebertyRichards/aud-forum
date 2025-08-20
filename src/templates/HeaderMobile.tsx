"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
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

export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null); 
  useEffect(() => {
    const userId = auth.user?.id;
    if (!userId) {
      setUserRole(null);
      setUserAvatarUrl(null);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/${userId}`);
        if (res.ok) {
          const profileData = await res.json();
          setUserRole(profileData.role);
          setUserAvatarUrl(profileData.avatar_url);
        } else {
          setUserRole(null);
          setUserAvatarUrl(null);
        }
      } catch (error) {
        setUserRole(null);
        setUserAvatarUrl(null);
      }
    };

    fetchUserProfile();
  }, [auth.user?.id]); 

  const allowedRoles = ["Fundador", "Leader", "Membro", "Desenvolvedor"];
  const canViewRules = userRole && allowedRoles.includes(userRole);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeNav = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (auth) {
      await auth.logout();
    }
    closeNav();
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
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/header.png"
              alt="Header Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </Link>
          <div className="flex items-center space-x-2">
            {auth?.loading ? (
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            ) : auth?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userAvatarUrl || ""}
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
              <div className="flex items-center space-x-1">
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ size: "sm" })}
                >
                  Registrar
                </Link>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Abrir menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <ModeToggle />
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t dark:border-gray-700 md:hidden">
          <div className="px-2 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
              onClick={closeNav}
            >
              Início
            </Link>
            <Link
              href="/members-list"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
              onClick={closeNav}
            >
              Membros
            </Link>
            <Link
              href="/subscribe"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
              onClick={closeNav}
            >
              Inscreva-se
            </Link>
            <Link
              href="/downloads"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
              onClick={closeNav}
            >
              Downloads
            </Link>
            {canViewRules && (
              <Link
                href="/rules"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
                onClick={closeNav}
              >
                Regras
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
