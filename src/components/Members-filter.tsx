"use client";

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

export function MembersFilters() {
  return (
    <div className="rounded-md border bg-gray-50 p-4 bg-white dark:bg-gray-800">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="Nome de usuário"
            className="bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="sort-by"
            className="text-sm font-medium text-gray-600"
          >
            Ordenar por
          </Label>
          <Select defaultValue="ultima-visita">
            <SelectTrigger id="sort-by" className="w-[180px] bg-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultima-visita">Última visita</SelectItem>
              <SelectItem value="data-inscricao">Data de inscrição</SelectItem>
              <SelectItem value="mensagens">Mensagens</SelectItem>
              <SelectItem value="nome-usuario">Nome de usuário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="decrescente">
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Ordem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="decrescente">Decrescente</SelectItem>
              <SelectItem value="crescente">Crescente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Ok</Button>
      </div>
    </div>
  );
}
