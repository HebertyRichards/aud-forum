"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/services/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { User } from "lucide-react";
import { API_URL } from "@/utils/forum-structure";

export function HeaderDesktop() {
  const auth = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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

  const handleLogout = async () => {
    await auth.logout();
  };

  const getUsername = () => {
    if (!auth?.user) return "";
    return auth.user.username || auth.user.email?.split("@")[0];
  };

  return (
    <header
      className="border-b shadow-sm 
                 bg-slate-800/80 
                 backdrop-blur supports-backdrop-filter:bg-slate-800/60
                 sticky top-0 z-50 w-full border-slate-700"
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
          <nav className="hidden md:flex space-x-6 items-center">
            <Link
              href="/"
              className="text-gray-300 hover:text-blue-400 transition-colors text-xs lg:text-sm"
            >
              Início
            </Link>
            <Link
              href="/members-list"
              className="text-gray-300 hover:text-blue-400 transition-colors text-xs lg:text-sm"
            >
              Membros
            </Link>
            <Link
              href="/topics/subscribes"
              className="text-gray-300 hover:text-blue-400 transition-colors text-xs lg:text-sm"
            >
              Inscreva-se
            </Link>
            <Link
              href="/topics/downloads"
              className="text-gray-300 hover:text-blue-400 transition-colors text-xs lg:text-sm"
            >
              Downloads
            </Link>
            <Link
              href="/topics"
              className="text-gray-300 hover:text-blue-400 transition-colors text-xs lg:text-sm"
            >
              Categorias
            </Link>
            {canViewRules && (
              <Link
                href="/rules"
                className="text-gray-300 hover:text-blue-400 transition-colors text-xs lg:text-sm"
              >
                Regras
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-3">
            {auth?.loading ? (
              <div className="h-9 w-9 bg-slate-700 rounded-full animate-pulse" />
            ) : auth?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9 border border-slate-600">
                      <AvatarImage
                        src={userAvatarUrl || ""}
                        alt={getUsername()}
                      />
                      <AvatarFallback className="bg-slate-700 text-white">
                        <User className="h-5 w-5 text-slate-300" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-slate-800 text-white border-slate-700"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getUsername()}
                      </p>
                      <p className="text-xs leading-none text-slate-400">
                        {auth.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer flex items-center"
                    >
                      <UserCircle className="mr-2 h-4 w-4" /> Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/user-settings"
                      className="cursor-pointer flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" /> Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 data-highlighted:bg-red-900/50 data-highlighted:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-blue-600 border-blue-500 text-white hover:bg-blue-500 hover:text-white"
                    >
                      Entrar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-100 bg-slate-800 text-white border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">
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
                  </DialogContent>
                </Dialog>
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      Registrar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-100 bg-slate-800 text-white border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">
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
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
