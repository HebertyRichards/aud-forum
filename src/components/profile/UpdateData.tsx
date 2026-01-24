"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth";
import { Loader2 } from "lucide-react";
import { formatDateForInput } from "@/utils/dateUtils";
import { UserProfile } from "@/schema/user";
import { useUpdateProfileData } from "@/hooks/useUpdateProfileData";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ProfileUpdateFormProps {
  profile: Partial<UserProfile>;
  onSuccess?: () => void;
}

export function UpdateData({ profile, onSuccess }: ProfileUpdateFormProps) {
  const { user } = useAuth()!;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: profile.username || "",
    gender: profile.gender || "",
    birthdate: formatDateForInput(profile.birthdate),
    location: profile.location || "",
  });

  const tSettings = useTranslations("settings");
  const tProfile = useTranslations("profile");
  const tCommon = useTranslations("common");

  const { mutate, isPending, error } = useUpdateProfileData(() => {
    setOpen(false);
    if (onSuccess) onSuccess();
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(value: string) {
    setForm((prev) => ({ ...prev, gender: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ ...form, id: user?.id });
  }

if(error) {
  toast.error("Erro ao atualizar perfil");
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full cursor-pointer dark:bg-slate-700 dark:border-slate-600 bg-slate-200 border border-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600">
          {tSettings("updateProfile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto dark:bg-slate-800 bg-slate-200 dark:border-slate-700 border-slate-100">
        <DialogHeader>
          <DialogTitle>{tSettings("editPersonalInfo")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="gender">{tProfile("gender")}</Label>
            <Select
              value={form.gender}
              onValueChange={handleSelectChange}
              disabled={isPending}
            >
              <SelectTrigger
                id="gender"
                className="w-full dark:border-slate-600 dark:bg-slate-700 border-slate-100 bg-slate-200"
              >
                <SelectValue placeholder={tCommon("select")} />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 bg-slate-200 dark:border-slate-700 border-slate-100">
                <SelectItem value="Masculino">{tProfile("genderOptions.male")}</SelectItem>
                <SelectItem value="Feminino">{tProfile("genderOptions.female")}</SelectItem>
                <SelectItem value="Outro">{tProfile("genderOptions.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="birthdate">{tProfile("birthdate")}</Label>
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              value={form.birthdate}
              onChange={handleChange} 
              disabled={isPending}
              className="dark:bg-slate-700 bg-slate-200 dark:border-slate-600 border-slate-100"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="location">{tProfile("location")}</Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={isPending}
              placeholder={tProfile("locationPlaceholder")}
              className="dark:bg-slate-700 bg-slate-200 dark:border-slate-600 border-slate-100"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-400 mt-4"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                {tSettings("saving")}
              </>
            ) : (
              tSettings("saveChanges")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
