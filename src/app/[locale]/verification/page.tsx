"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function VerificationEmail() {
  const t = useTranslations("pages.verification");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl dark:bg-slate-800 bg-slate-200 dark:border-slate-700 border-slate-100">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <MailCheck className="w-10 h-10" />
          <CardTitle className="text-2xl font-semibold">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
