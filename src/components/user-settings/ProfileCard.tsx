"use client";

import { useState } from "react";
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
import type { UserWithProfile } from "@/types/autentication";
import { X } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useTranslations } from "next-intl";

type ProfileCardProps = {
  user: UserWithProfile;
  onClose: () => void;
};

export function ProfileCard({ user, onClose }: ProfileCardProps) {
  const [username, setUsername] = useState(user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");

  const t = useTranslations("settings");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  const { mutate, isPending } = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      username,
      newEmail: email,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-100 relative animate-in fade-in-0 zoom-in-95">
        <CardHeader>
          <CardTitle>{t("updateProfile")}</CardTitle>
          <CardDescription>
            {t("profileUpdated")}
          </CardDescription>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 dark:text-gray-400 text-gray-700 hover:text-red-500 transition-opacity"
            aria-label={tCommon("cancel")}
          >
            <X size={24} />
          </button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="username">{tAuth("username")}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{tAuth("email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100"
                disabled={isPending}
              />
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              type="submit"
              className="bg-blue-500 border border-blue-400 hover:bg-blue-400"
              disabled={isPending}
            >
              {isPending ? tCommon("loading") : tCommon("save")}
            </Button>
            <Button
              type="button"
              className="dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border-slate-100 dark:hover:bg-slate-600 hover:bg-slate-100"
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
