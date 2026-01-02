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
} from "@/components/ui/dialog";
import { useAuth } from "@/services/auth";
import { Loader2 } from "lucide-react";
import { ProfileUpdateFormProps } from "@/types/profile";
import { formatDateForInput } from "@/utils/dateUtils";
import { toast } from "sonner";

export function UpdateData({ profile, onSuccess }: ProfileUpdateFormProps) {
  const { user } = useAuth()!;
  const [form, setForm] = useState({
    username: profile.username || "",
    gender: profile.gender || "",
    birthdate: formatDateForInput(profile.birthdate),
    location: profile.location || "",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(value: string) {
    setForm((prev) => ({ ...prev, gender: value }));
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
        throw new Error(errorData.message || "Falha ao atualizar o perfil.");
      }
      const data = await res.json();
      toast.success("Perfil atualizado com sucesso!", { id: toastId });
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
          <DialogTitle>Atualizar Perfil</DialogTitle>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-slate-800 text-white border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="gender">Gênero</Label>
          <Select value={form.gender} onValueChange={handleSelectChange}>
            <SelectTrigger
              id="gender"
              className="flex h-9 w-full min-w-0 rounded-md border border-slate-600 bg-slate-700"
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 text-white border border-slate-700">
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Feminino">Feminino</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="birthdate">Nascimento</Label>
          <Input
            id="birthdate"
            name="birthdate"
            type="date"
            value={form.birthdate}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 text-white"
          />
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="bg-slate-700 border border-slate-600 text-white"
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 border border-blue-400 hover:bg-blue-400 mt-4"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            ) : null}
            Salvar alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
