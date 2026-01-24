"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth";
import { ProfileCard } from "@/components/user-settings/ProfileCard";
import { PasswordCard } from "@/components/user-settings/PasswordCard";
import { DangerZoneCard } from "@/components/user-settings/DangerZoneCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export default function UserSettingsPageClient() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();
  const t = useTranslations("settings");
  const tAuth = useTranslations("auth");

  const [activeForm, setActiveForm] = useState<"profile" | "password" | null>(
    null
  );

  useEffect(() => {
    if (!auth.loading && !user) {
      router.push("/");
    }
  }, [auth.loading, user, router]);

  if (auth.loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">{t("checkingSession")}</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      {activeForm === "profile" ? (
        <ProfileCard user={user} onClose={() => setActiveForm(null)} />
      ) : activeForm === "password" ? (
        <PasswordCard onClose={() => setActiveForm(null)} />
      ) : (
        <div className="flex-1 space-y-8 p-8 pt-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
            <p className="text-muted-foreground">
              {t("manageSettings")}
            </p>
          </div>
          <Card className="bg-slate-200 dark:bg-slate-800 dark:border-slate-700 border-slate-100">
            <CardHeader>
              <CardTitle>{t("profileAndPassword")}</CardTitle>
              <CardDescription>
                {t("profileAndPasswordDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium">{tAuth("username")}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.username}
                  </p>
                </div>
              </div>
              <Separator className="bg-slate-100 dark:bg-slate-700" />
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium">{tAuth("email")}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email ?? "N/A"}
                  </p>
                </div>
                <Button
                  className="dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100 dark:hover:bg-slate-600 hover:bg-slate-100"
                  onClick={() => setActiveForm("profile")}
                >
                  {t("updateProfile")}
                </Button>
              </div>
              <Separator className="bg-slate-100 dark:bg-slate-700" />
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium">{tAuth("password")}</p>
                  <p className="text-sm text-muted-foreground">********</p>
                </div>
                <Button
                  className="dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100 dark:hover:bg-slate-600 hover:bg-slate-100"
                  onClick={() => setActiveForm("password")}
                >
                  {t("changePassword")}
                </Button>
              </div>
            </CardContent>
          </Card>
          <DangerZoneCard />
        </div>
      )}
    </>
  );
}
