"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth";
import { UserProfile } from "@/schema/user";
import { useUpdateContacts } from "@/hooks/useUpdateContacts";
import { useTranslations } from "next-intl";

interface ProfileUpdateFormProps {
  profile: Partial<UserProfile>;
  onSuccess?: () => void;
}

export function UpdateContacts({ profile, onSuccess }: ProfileUpdateFormProps) {
  const { user } = useAuth()!;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    website: profile.website || "",
    facebook: profile.facebook || "",
    instagram: profile.instagram || "",
    discord: profile.discord || "",
    steam: profile.steam || "",
  });

  const tSettings = useTranslations("settings");
  const tProfile = useTranslations("profile");

  const { mutate, isPending } = useUpdateContacts(() => {
    setOpen(false);
    if (onSuccess) onSuccess();
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ ...form, id: user?.id });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full cursor-pointer bg-slate-700 border border-slate-600 hover:bg-slate-600">
          {tSettings("updateContacts")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md mx-auto bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>{tSettings("editContacts")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="website">{tProfile("website")}</Label>
            <Input
              id="website"
              name="website"
              value={form.website}
              onChange={handleChange}
              disabled={isPending}
              className="bg-slate-700 border border-slate-600 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="facebook">{tProfile("facebook")}</Label>
            <Input
              id="facebook"
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              disabled={isPending}
              className="bg-slate-700 border border-slate-600 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="instagram">{tProfile("instagram")}</Label>
            <Input
              id="instagram"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              disabled={isPending}
              className="bg-slate-700 border border-slate-600 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="discord">{tProfile("discord")}</Label>
            <Input
              id="discord"
              name="discord"
              value={form.discord}
              onChange={handleChange}
              disabled={isPending}
              className="bg-slate-700 border border-slate-600 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="steam">{tProfile("steam")}</Label>
            <Input
              id="steam"
              name="steam"
              value={form.steam}
              onChange={handleChange}
              disabled={isPending}
              className="bg-slate-700 border border-slate-600 text-white"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 mt-4"
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
