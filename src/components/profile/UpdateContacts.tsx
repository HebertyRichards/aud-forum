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
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { ProfileUpdateFormProps } from "@/types/profile";
import { toast } from "sonner";
import axios from "axios";

export function UpdateContacts({ profile, onSuccess }: ProfileUpdateFormProps) {
  const { user } = useAuth()!;
  const [form, setForm] = useState({
    website: profile.website || "",
    facebook: profile.facebook || "",
    instagram: profile.instagram || "",
    discord: profile.discord || "",
    steam: profile.steam || "",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) {
    if ("target" in e) {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [e.name]: e.value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Salvando alterações...");

    try {
      const payload = { ...form, id: user?.id };

      await axios.put(`/api/profile/update`, payload, {
        withCredentials: true,
      });

      toast.success("Perfil atualizado com sucesso!", { id: toastId });
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro inesperado";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.error || "Erro ao atualizar o perfil";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full cursor-pointer">
          <DialogTitle>Atualizar Contatos</DialogTitle>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={form.website}
            onChange={handleChange}
          />
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
          />
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
          />
          <Label htmlFor="discord">Discord</Label>
          <Input
            id="discord"
            name="discord"
            value={form.discord}
            onChange={handleChange}
          />
          <Label htmlFor="steam">Steam</Label>
          <Input
            id="steam"
            name="steam"
            value={form.steam}
            onChange={handleChange}
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            Salvar alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
