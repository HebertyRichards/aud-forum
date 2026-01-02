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

      const res = await fetch(`/api/profile/update`, {
        method: "PUT",
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Falha ao atualizar os contatos.");
      }
      const data = await res.json();
      toast.success("Contatos atualizados com sucesso!", { id: toastId });
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro inesperado";
      if (error instanceof Error) {
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
        <Button className="w-full cursor-pointer bg-slate-700 border border-slate-600 hover:bg-slate-600">
          <DialogTitle>Atualizar Contatos</DialogTitle>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-slate-800 text-white border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 text-white"
          />
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 text-white"
          />
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 text-white"
          />
          <Label htmlFor="discord">Discord</Label>
          <Input
            id="discord"
            name="discord"
            value={form.discord}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 text-white"
          />
          <Label htmlFor="steam">Steam</Label>
          <Input
            id="steam"
            name="steam"
            value={form.steam}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 text-white"
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 border border-blue-400 hover:bg-blue-400 mt-4"
          >
            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            Salvar alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
