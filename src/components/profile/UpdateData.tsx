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
import axios from "axios";

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

      await axios.put(`${API_URL}/profile/update`, payload, {
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
          <DialogTitle>Atualizar Perfil</DialogTitle>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="gender">Gênero</Label>
          <Select value={form.gender} onValueChange={handleSelectChange}>
            <SelectTrigger
              id="gender"
              className="flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs"
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
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
          />
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Salvar alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
