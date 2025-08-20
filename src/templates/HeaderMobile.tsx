"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";

export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const openNav = () => {
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
          <div className="flex items-center space-x-2">
            <Image
              src="/header.png"
              alt="Header Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <button
              onClick={openNav}
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
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-600 transition-colors text-sm"
              onClick={closeNav}
            >
              Início
            </Link>
            <Link
              href="/members-list"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-600 transition-colors text-sm"
              onClick={closeNav}
            >
              Membros
            </Link>
            <Link
              href="/subscribe"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-600 transition-colors text-sm"
              onClick={closeNav}
            >
              Inscreva-se
            </Link>
            <Link
              href="/downloads"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-600 transition-colors text-sm"
              onClick={closeNav}
            >
              Downloads
            </Link>
            {/* se estiver logado aparece regras e for membro / dono*/}
            <Link
              href="/rules"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-600 transition-colors text-sm"
              onClick={closeNav}
            >
              Regras
            </Link>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="px-3 py-2">
              {auth?.loading ? (
                <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
              ) : auth?.user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline"
                    onClick={closeNav}
                  >
                    Olá, {getUsername()}
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                    onClick={closeNav}
                  >
                    Entrar
                  </Link>

                  <Link
                    href="/register"
                    className={buttonVariants({ size: "sm" })}
                    onClick={closeNav}
                  >
                    Registrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
