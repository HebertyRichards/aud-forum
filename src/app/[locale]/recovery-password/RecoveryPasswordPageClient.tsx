"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function RecoveryPasswordPageClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const t = useTranslations("pages.recoveryPassword");
  const tAuth = useTranslations("auth");

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email.trim());
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast.error(t("invalidEmail"));
      return;
    }

    if (!email || !isValidEmail(email)) {
      toast.error(t("invalidEmail"));
      return;
    }

    setLoading(true);

    try {
      await auth.forgotPassword(email.trim());
      toast.success(t("emailSent"));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("invalidEmail"));
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md dark:border-gray-700 dark:text-gray-300 dark:bg-slate-800 border-gray-100 text-gray-700 bg-slate-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {t("title")}
            </CardTitle>
            <CardDescription className="pt-2">
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  {tAuth("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={tAuth("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark:bg-slate-700 dark:border-slate-600 "
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="dark:bg-slate-700 dark:border-slate-600 bg-slate-100 border border-slate-100 dark:hover:bg-slate-600"
            >
              {loading ? t("sending") : t("sendLink")}
            </Button>
            <Button variant="link" asChild>
              <Link href="/" className="hover:text-blue-300">
                {t("backToLogin")}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
