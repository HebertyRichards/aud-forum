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
import { useAuth } from "@/services/auth";
import { Loader2 } from "lucide-react";
import { formatDateForInput } from "@/utils/dateUtils";
import { UserProfile } from "@/schema/user";
import { useUpdateProfileData } from "@/hooks/useUpdateProfileData";

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full cursor-pointer bg-slate-700 border border-slate-600 hover:bg-slate-600">
          Atualizar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>Editar Informações Pessoais</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="gender">Gênero</Label>
            <Select
              value={form.gender}
              onValueChange={handleSelectChange}
              disabled={isPending}
            >
              <SelectTrigger
                id="gender"
                className="w-full border-slate-600 bg-slate-700 text-white"
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border-slate-700">
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Feminino">Feminino</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="birthdate">Nascimento</Label>
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              value={form.birthdate}
              onChange={handleChange}
              disabled={isPending}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={isPending}
              placeholder="Ex: São Paulo, Brasil"
              className="bg-slate-700 border-slate-600 text-white"
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
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
