"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
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
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/toggle-mode";
import { useTranslations } from "next-intl";
import { useFetchUserProfile } from "@/hooks/useFetchUserProfile";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const t = useTranslations("header");

  const auth = useAuth();
  const username = auth.user?.username ?? "";
  
  const { data: profileData } = useFetchUserProfile(username);
  
  const userRole = profileData?.profile?.role ?? null;
  const userAvatarUrl = profileData?.profile?.avatar_url ?? null;

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

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
    { href: "/", label: "home" },
    { href: "/members-list", label: "members" },
    { href: "/topics/subscribes", label: "subscribe" },
    { href: "/topics/downloads", label: "downloads" },
    { href: "/topics", label: "categories" },
    ...(canViewRules ? [{ href: "/rules", label: "rules" }] : []),
  ];

  const fullScreenModalClasses =
    "fixed z-[100] left-0 top-0 w-screen h-[100dvh] max-w-none m-0 p-0 " +
    "translate-x-0 translate-y-0 rounded-none border-none bg-slate-200 dark:bg-slate-800 " +
    "flex flex-col justify-center items-center data-[state=open]:animate-in data-[state=closed]:animate-out";

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-sm bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur supports-backdrop-filter:bg-slate-300/60 dark:supports-backdrop-filter:bg-slate-800/60 border-slate-300 dark:border-slate-700">
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
                className="dark:text-gray-300 text-gray-700 hover:text-blue-400 transition-colors text-xs lg:text-sm"
              >
                {t(link.label)}
              </Link>
            ))}
            <LanguageSwitcher />
          </nav>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <ModeToggle />
            </div>
            {auth?.loading ? (
              <div className="h-8 w-8 md:h-9 md:w-9 bg-slate-700 rounded-full animate-pulse" />
            ) : auth?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full">
                    <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-slate-600">
                      <AvatarImage src={userAvatarUrl || ""} alt={getUsername()} />
                      <AvatarFallback className="bg-slate-100 dark:bg-slate-600">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUsername()}</p>
                      <p className="text-xs leading-none text-slate-600 dark:text-slate-400">{auth.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-300 dark:bg-slate-700" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" /> {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user-settings" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" /> {t("settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-300 dark:bg-slate-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 data-highlighted:bg-red-900/50 data-highlighted:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> {t("logout")}
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
                      className="bg-blue-600 border-blue-500 hover:bg-blue-500"
                    >
                      {t("login")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`${fullScreenModalClasses} md:fixed md:z-50 md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:w-full md:max-w-md md:h-auto md:rounded-lg md:border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 p-6`}>
                    <div className="w-full max-w-md px-6 md:px-0">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-center text-2xl text-slate-900 dark:text-white">{t("welcomeBack")}</DialogTitle>
                        <DialogDescription className="text-center text-slate-600 dark:text-slate-400">{t("accessAccount")}</DialogDescription>
                      </DialogHeader>
                      <LoginForm onSuccess={() => setIsLoginOpen(false)} onSwitchToRegister={openRegister} />
                      <Button variant="ghost" className="mt-4 w-full text-slate-500 md:hidden" onClick={() => setIsLoginOpen(false)}>
                        {t("cancel")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-700 hover:bg-slate-200/50 hidden md:flex"
                    >
                      {t("register")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`${fullScreenModalClasses} md:fixed md:z-50 md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:w-full md:max-w-md md:h-auto md:rounded-lg md:border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 md:p-6`}>
                    <div className="w-full max-w-md px-6 md:px-0 flex flex-col items-center">
                      <DialogHeader className="mb-6 w-full">
                        <DialogTitle className="text-center text-2xl text-slate-900 dark:text-white">{t("createAccount")}</DialogTitle>
                        <DialogDescription className="text-center text-slate-600 dark:text-slate-400">{t("fillData")}</DialogDescription>
                      </DialogHeader>
                      <RegisterForm onSuccess={() => setIsRegisterOpen(false)} onSwitchToLogin={openLogin} />
                      <Button variant="ghost" className="mt-4 w-full text-slate-500 md:hidden" onClick={() => setIsRegisterOpen(false)}>
                        {t("cancel")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  className="dark:bg-slate-700 bg-slate-200 border dark:border-s
                  late-600 border-slate-400 hover:dark:bg-slate-600 hover:bg-slate-300 dark:text-white text-slate-900 md:hidden"
                  onClick={openRegister}
                >
                      {t("register")}
                </Button>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md transition-colors md:hidden border border-slate-400 dark:border-transparent text-slate-900 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-700"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                onClick={closeNav}
              >
                {t(link.label)}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
