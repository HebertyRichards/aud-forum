"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/auth";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { RolesAuthorizedSchema } from "@/schema/user";
import { useTranslations } from "next-intl";

export default function Rules() {
  const { user, loading } = useAuth();
  const t = useTranslations("pages.rules");

  const hasPermission = user?.role
    ? RolesAuthorizedSchema.safeParse(user.role).success
    : false;

  useEffect(() => {
    if (!loading && (!user || !hasPermission)) {
      notFound();
    }
  }, [user, loading, hasPermission]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="ml-2">{t("checkingPermissions")}</p>
      </div>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="dark:bg-slate-800 bg-slate-200 p-6 rounded-lg shadow-md">
        <div className="flex justify-center items-center gap-x-4 mb-6">
          <Image
            src="/header.png"
            alt="Header Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <h1 className="text-3xl font-bold text-center">
            {t("title")}
          </h1>
          <Image
            src="/header.png"
            alt="Header Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
        </div>
        <ol
          className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300 text-justify 
                     marker:font-bold"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i}>{t(`rule${i + 1}`)}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
