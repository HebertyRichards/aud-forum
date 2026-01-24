"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";
import { useTranslations } from "next-intl";

type PasswordCardProps = {
  onClose: () => void;
};

export function PasswordCard({ onClose }: PasswordCardProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const t = useTranslations("settings");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  const { mutate, isPending } = useUpdatePassword(onClose);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(tAuth("passwordsNotMatch"));
      return;
    }
    mutate(newPassword);
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <Card className="dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-100">
        <CardHeader>
          <CardTitle>{t("changePassword")}</CardTitle>
          <CardDescription>
            {t("deleteAccountWarning")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <Label htmlFor="new-password">{t("newPassword")}</Label>
            <div className="relative max-w-sm">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100 pr-10"
                disabled={isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 dark:text-slate-400 text-slate-700 dark:hover:bg-slate-600 hover:bg-slate-100 hover:text-black dark:hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Label htmlFor="confirm-password">{t("confirmNewPassword")}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="max-w-sm dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100"
              disabled={isPending}
            />
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-500 dark:over:bg-blue-600 hover:bg-blue-400"
            >
              {isPending ? tCommon("loading") : t("updatePassword")}
            </Button>
            <Button
              type="button"
              className="dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100"
              onClick={onClose}
              disabled={isPending}
            >
              {tCommon("cancel")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
