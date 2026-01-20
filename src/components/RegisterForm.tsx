"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const auth = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error(t("usernameRequired"));
      return;
    }

    setLoading(true);

    try {
      await auth.register(username, email, password);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        router.push("/verification");
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("passwordRequired"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="username">{t("username")}</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("usernamePlaceholder")}
          disabled={loading}
          className="bg-slate-900 border-slate-700"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          disabled={loading}
          className="bg-slate-900 border-slate-700"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="bg-slate-900 border-slate-700 pr-10"
            required
            placeholder="********"
          />
          <Button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white bg-transparent hover:bg-transparent cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 mt-2"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          t("registerButton")
        )}
      </Button>
      <div className="text-center text-sm text-slate-400 mt-4">
        {t("hasAccount")}{" "}
        <Button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-400 hover:underline hover:text-blue-300 transition-colors bg-transparent hover:bg-transparent"
        >
          {t("loginHere")}
        </Button>
      </div>
    </form>
  );
}
