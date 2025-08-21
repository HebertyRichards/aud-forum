"use client";

import React, { useState } from "react";
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
import { UpdateDataProps } from "@/types/profile";
import { formatDateForInput } from "@/utils/dateUtils";
import { toast } from "sonner";

export function UpdateData({ profile, onSuccess }: UpdateDataProps) {
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
      const res = await fetch(`${API_URL}/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          id: user?.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Erro ao atualizar perfil");
      }

      await res.json();
      toast.success("Perfil atualizado com sucesso!", { id: toastId });
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro inesperado";
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
