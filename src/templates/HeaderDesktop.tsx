"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/services/auth";
import { Button, buttonVariants } from "@/components/ui/button";
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
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);

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
    if (auth.logout) {
      await auth.logout();
    }
    router.push("/login");
  };

  const getUsername = () => {
    if (!auth?.user) return "";
    return auth.user.username || auth.user.email?.split("@")[0];
  };

  return (
    <header
      className="border-b shadow-sm 
                 bg-slate-800/80 
                 backdrop-blur supports-[backdrop-filter]:bg-slate-800/60
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
              <div className="h-9 w-40 bg-slate-700 rounded-md animate-pulse" />
            ) : auth?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userAvatarUrl || ""}
                        alt={getUsername()}
                      />
                      <AvatarFallback className="bg-slate-600">
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
                  <DropdownMenuLabel className="font-normal">
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
                    <Link href="/profile" className="cursor-pointer">
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user-settings" className="cursor-pointer">
                      Configurações
                    </Link>
                  </DropdownMenuItem>
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
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "h-8 px-2 text-xs lg:h-9 lg:px-3 lg:text-sm bg-blue-500 border border-blue-400 text-white hover:bg-blue-400 hover:text-white",
                  })}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({
                    className:
                      "h-8 px-2 text-xs lg:h-9 lg:px-4 lg:text-sm bg-slate-700 border border-slate-600 hover:bg-slate-600",
                  })}
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
