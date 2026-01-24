"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function SuccessRegister() {
  const [countdown, setCountdown] = useState(7);
  const router = useRouter();
  const t = useTranslations("pages.confirmation");

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md w-full dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-100">
        <CardHeader className="text-center">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            {t("redirecting")} {countdown} {t("seconds")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-700 dark:text-slate-300">
            {t("welcome")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
