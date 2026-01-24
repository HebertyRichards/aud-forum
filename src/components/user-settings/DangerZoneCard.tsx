"use client";

import { useState, useEffectEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useTranslations } from "next-intl";

export function DangerZoneCard() {
  const [step, setStep] = useState<"initial" | "confirmPassword">("initial");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("settings");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  const { mutate, isPending } = useDeleteAccount();

  const handleOpenChange = useEffectEvent((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStep("initial");
      setPassword("");
    }
  });

  const handleConfirmDelete = () => {
    if (!password) {
      toast.error(tAuth("passwordRequired"));
      return;
    }
    mutate(password);
  };

  return (
    <Card className="dark:border-slate-700 dark:bg-slate-800 border-slate-100 bg-slate-200 hover:border-red-500/50 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-red-500">{t("deleteAccount")}</CardTitle>
        <CardDescription>
          {t("deleteAccountWarning")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">{t("deleteAccount")}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-200 border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteAccount")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteAccountWarning")}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {step === "confirmPassword" && (
              <div className="my-4 space-y-2">
                <Label htmlFor="password-confirm">
                  {t("confirmDeleteAccount")}
                </Label>
                <Input
                  id="password-confirm"
                  type="password"
                  placeholder={tAuth("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  className="dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100"
                />
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel
                className="dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer"
                disabled={isPending}
              >
                {tCommon("cancel")}
              </AlertDialogCancel>

              {step === "initial" ? (
                <AlertDialogAction
                  className="dark:bg-destructive dark:text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep("confirmPassword");
                  }}
                >
                  {tCommon("confirm")}
                </AlertDialogAction>
              ) : (
                <AlertDialogAction
                  className="dark:bg-destructive dark:text-destructive-foreground hover:bg-destructive/50"
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                >
                  {isPending ? tCommon("loading") : tCommon("confirm")}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
