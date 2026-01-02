"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/services/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const auth = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  useEffect(() => {
    const username = auth.user?.username;
    if (!username) {
      setUserRole(null);
      setUserAvatarUrl(null);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/${username}`);
        if (res.ok) {
          const profileData = await res.json();
          setUserRole(profileData.role);
          setUserAvatarUrl(profileData.avatar_url);
        } else {
          setUserRole(null);
          setUserAvatarUrl(null);
        }
      } catch {
        setUserRole(null);
        setUserAvatarUrl(null);
      }
    };

    fetchUserProfile();
  }, [auth.user?.username]);

  const allowedRoles = ["Fundador", "Leader", "Auditore", "Desenvolvedor"];
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
  };

  const getUsername = () => {
    if (!auth?.user) return "";
    return auth.user.username || auth.user.email?.split("@")[0];
  };

  const fullScreenModalClasses =
    "fixed z-[100] left-0 top-0 w-screen h-[100dvh] max-w-none m-0 p-0 " +
    "translate-x-0 translate-y-0 rounded-none border-none bg-slate-800 " +
    "flex flex-col justify-center items-center data-[state=open]:animate-in data-[state=closed]:animate-out";

  return (
    <header
      className="sticky top-0 z-50 w-full 
             border-b shadow-sm 
            bg-slate-800/80 
             backdrop-blur supports-[backdrop-filter]:bg-slate-800/60 border-slate-700"
    >
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
              <div className="h-8 w-24 bg-slate-700 rounded-md animate-pulse" />
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
                <DropdownMenuContent
                  className="w-56 bg-slate-800 text-white border-slate-700"
                  align="end"
                  forceMount
                >
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
                  <DropdownMenuSeparator className="bg-slate-700" />
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
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 data-[highlighted]:bg-red-900/50 data-[highlighted]:text-red-400"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-1">
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-500 border border-blue-400 text-white hover:bg-blue-400 hover:text-white"
                    >
                      Entrar
                    </Button>
                  </DialogTrigger>

                  <DialogContent className={fullScreenModalClasses}>
                    <div className="w-full max-w-md px-6">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-center text-2xl text-white">
                          Bem-vindo de volta
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-400">
                          Acesse sua conta para continuar
                        </DialogDescription>
                      </DialogHeader>
                      <LoginForm
                        onSuccess={() => setIsLoginOpen(false)}
                        onSwitchToRegister={openRegister}
                      />
                      <Button
                        variant="ghost"
                        className="mt-4 w-full text-slate-500"
                        onClick={() => setIsLoginOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white"
                    >
                      Registrar
                    </Button>
                  </DialogTrigger>

                  <DialogContent className={fullScreenModalClasses}>
                    <div className="w-full max-w-md px-6 overflow-y-auto max-h-[100dvh] py-8">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-center text-2xl text-white">
                          Crie sua conta
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-400">
                          Preencha os dados abaixo para começar
                        </DialogDescription>
                      </DialogHeader>
                      <RegisterForm
                        onSuccess={() => {}}
                        onSwitchToLogin={openLogin}
                      />
                      <Button
                        variant="ghost"
                        className="mt-4 w-full text-slate-500"
                        onClick={() => setIsRegisterOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700"
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
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t border-slate-700 md:hidden">
          <div className="px-2 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hovertext-blue-400"
              onClick={closeNav}
            >
              Início
            </Link>
            <Link
              href="/members-list"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hovertext-blue-400"
              onClick={closeNav}
            >
              Membros
            </Link>
            <Link
              href="/topics/subscribes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hovertext-blue-400"
              onClick={closeNav}
            >
              Inscreva-se
            </Link>
            <Link
              href="/topics/downloads"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hovertext-blue-400"
              onClick={closeNav}
            >
              Downloads
            </Link>
            <Link
              href="/topics"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hovertext-blue-400"
              onClick={closeNav}
            >
              Categorias
            </Link>
            {canViewRules && (
              <Link
                href="/rules"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hovertext-blue-400"
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
