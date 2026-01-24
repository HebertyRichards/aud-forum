"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { handleError } from "@/utils/errorsApi";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type LoginFormProps = {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
};

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t("emailRequired"));
      return;
    }
    setLoading(true);
    try {
      await auth?.login(email, password, keepLoggedIn);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error(t("loginButton"));
      handleError(error, t("loginButton"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">
          {t("email")}
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
          placeholder={t("emailPlaceholder")}
          required
          className="dark:bg-slate-900 dark:border-slate-600 dark:placeholder:text-slate-400 bg-slate-300 border-slate-100 placeholder:text-slate-800"
          disabled={loading}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">
            {t("password")}
          </Label>
          <Link
            href="/recovery-password"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline dark:text-slate-400 dark:hover:text-white text-slate-700 hover:text-black"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          className="dark:bg-slate-900 dark:border-slate-600 dark:placeholder:text-slate-400 bg-slate-300 border-slate-100 placeholder:text-slate-800"
            placeholder="********"
            disabled={loading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-slate-400 bg-transparent hover:text-white hover:bg-transparent cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="keep-logged-in"
          checked={keepLoggedIn}
          onCheckedChange={(checked) => setKeepLoggedIn(!!checked)}
          disabled={loading}
          className="dark:border-slate-600 border-slate-100 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400"
        />
        <Label
          htmlFor="keep-logged-in"
          className="text-sm font-medium leading-none"
        >
          {t("rememberMe")}
        </Label>
      </div>
      <div className="flex flex-col gap-4 pt-2">
        <Button
          type="submit"
          className="w-full bg-blue-500 border border-blue-400 hover:bg-blue-400"
          disabled={loading}
        >
          {loading ? t("loggingIn") : t("loginButton")}
        </Button>
        <div className="text-center text-sm text-slate-700 dark:text-slate-400">
          {t("noAccount")}{" "}
          <Button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-400 hover:underline hover:text-blue-300 transition-colors bg-transparent hover:bg-transparent"
          >
            {t("registerHere")}
          </Button>
        </div>
      </div>
    </form>
  );
}
