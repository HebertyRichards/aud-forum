"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MembersFiltersProps } from "@/types/users";

export function MembersFilters({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: MembersFiltersProps) {
  return (
    <div className="rounded-md border bg-slate-800 p-4 border-slate-700">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4">
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <Input
            type="text"
            placeholder="Nome de usuário"
            className="border-slate-600 bg-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:w-auto">
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Label
              htmlFor="sort-by"
              className="text-sm font-medium text-slate-700"
            >
              Ordenar por
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                id="sort-by"
                className="w-full sm:w-[180px] border-slate-600 bg-slate-700"
                aria-label="Ordenar por"
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="ultima-visita">Última visita</SelectItem>
                <SelectItem value="data-inscricao">
                  Data de inscrição
                </SelectItem>
                <SelectItem value="mensagens">Mensagens</SelectItem>
                <SelectItem value="nome-usuario">Nome de usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[150px] bg-slate-700 border-slate-600">
                <SelectValue placeholder="Ordem" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 text-white border-slate-600">
                <SelectItem value="decrescente" className="bg-slate-600">
                  Decrescente
                </SelectItem>
                <SelectItem value="crescente">Crescente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
