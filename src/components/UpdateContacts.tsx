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
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth";
import { UpdateContactsProps } from "@/types/users";

export function UpdateContacts({ profile, onSuccess }: UpdateContactsProps) {
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

    try {
      const res = await fetch(`${API_URL}/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, id: user?.id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Erro ao atualizar contatos");
      }

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError("Ocorreu uma falha inesperada.");
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
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-gray-800">
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
