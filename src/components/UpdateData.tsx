"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/services/auth";
import { Loader2 } from "lucide-react";

interface AtualizarDadosProps {
  profile: {
    username: string;
    gender?: string;
    birthdate?: string;
    location?: string;
    website?: string;
  };
  onSuccess?: () => void;
}

export function UpdateData({ profile, onSuccess }: AtualizarDadosProps) {
  const { user } = useAuth()!;
  const [form, setForm] = useState({
    username: profile.username || "",
    gender: profile.gender || "",
    birthdate: profile.birthdate || "",
    location: profile.location || "",
    website: profile.website || "",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

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

      if (!res.ok) throw new Error("Erro ao atualizar perfil");

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <DialogTitle>Atualizar Perfil</DialogTitle>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Nome de usuário</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="gender">Gênero</Label>
            <Input
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="birthdate">Nascimento</Label>
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              value={form.birthdate}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={form.website}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Salvar alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
