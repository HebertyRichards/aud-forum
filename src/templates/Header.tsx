"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/auth";
import { Button } from "@/components/ui/button";
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
import { User, LogOut, Settings, UserCircle, Menu, X } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { API_URL } from "@/utils/forum-structure";

export default function Header() {
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeNav = () => setIsMenuOpen(false);

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

  const menuLinks = [
    { href: "/", label: "Início" },
    { href: "/members-list", label: "Membros" },
    { href: "/topics/subscribes", label: "Inscreva-se" },
    { href: "/topics/downloads", label: "Downloads" },
    { href: "/topics", label: "Categorias" },
    ...(canViewRules ? [{ href: "/rules", label: "Regras" }] : []),
  ];

  const fullScreenModalClasses =
    "fixed z-[100] left-0 top-0 w-screen h-[100dvh] max-w-none m-0 p-0 " +
    "translate-x-0 translate-y-0 rounded-none border-none bg-slate-800 " +
    "flex flex-col justify-center items-center data-[state=open]:animate-in data-[state=closed]:animate-out";

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-sm bg-slate-800/80 backdrop-blur supports-backdrop-filter:bg-slate-800/60 border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" onClick={closeNav}>
            <Image
              src="/header.png"
              alt="Header Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-blue-400 transition-colors text-xs lg:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            {auth?.loading ? (
              <div className="h-8 w-8 md:h-9 md:w-9 bg-slate-700 rounded-full animate-pulse" />
            ) : auth?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full">
                    <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-slate-600">
                      <AvatarImage src={userAvatarUrl || ""} alt={getUsername()} />
                      <AvatarFallback className="bg-slate-700 text-white">
                        <User className="h-5 w-5 text-slate-300" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 text-white border-slate-700" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUsername()}</p>
                      <p className="text-xs leading-none text-slate-400">{auth.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" /> Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user-settings" className="cursor-pointer flex items-center">
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
              <div className="flex items-center space-x-2">
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-600 border-blue-500 text-white hover:bg-blue-500 hover:text-white"
                    >
                      Entrar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`${fullScreenModalClasses} md:fixed md:z-50 md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:w-full md:max-w-md md:h-auto md:rounded-lg md:border md:border-slate-700 md:bg-slate-800 md:p-6`}>
                    <div className="w-full max-w-md px-6 md:px-0">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-center text-2xl text-white">Bem-vindo de volta</DialogTitle>
                        <DialogDescription className="text-center text-slate-400">Acesse sua conta para continuar</DialogDescription>
                      </DialogHeader>
                      <LoginForm onSuccess={() => setIsLoginOpen(false)} onSwitchToRegister={openRegister} />
                      <Button variant="ghost" className="mt-4 w-full text-slate-500 md:hidden" onClick={() => setIsLoginOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-700 hidden md:flex"
                    >
                      Registrar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`${fullScreenModalClasses} md:fixed md:z-50 md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:w-full md:max-w-md md:h-auto md:max-h-[85vh] md:rounded-lg md:border md:border-slate-700 md:bg-slate-800 md:p-6 md:overflow-y-auto`}>
                    <div className="w-full max-w-md px-6 md:px-0 flex flex-col items-center">
                      <DialogHeader className="mb-6 w-full">
                        <DialogTitle className="text-center text-2xl text-white">Crie sua conta</DialogTitle>
                        <DialogDescription className="text-center text-slate-400">Preencha os dados abaixo para começar</DialogDescription>
                      </DialogHeader>
                      <RegisterForm onSuccess={() => { }} onSwitchToLogin={openLogin} />
                      <Button variant="ghost" className="mt-4 w-full text-slate-500 md:hidden" onClick={() => setIsRegisterOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white md:hidden"
                  onClick={openRegister}
                >
                  Registrar
                </Button>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700 md:hidden"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t border-slate-700 md:hidden animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-500 hover:bg-slate-700 transition-colors"
                onClick={closeNav}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
