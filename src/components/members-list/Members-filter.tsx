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
import { useTranslations } from "next-intl";

interface MembersFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export function MembersFilters({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: MembersFiltersProps) {
  const t = useTranslations("forum");

  return (
    <div className="rounded-md border dark:bg-slate-800 bg-slate-200 p-4 dark:border-slate-700 border-slate-710">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4">
        <div className="w-full sm:flex-1 sm:min-w-50">
          <Input
            type="text"
            placeholder="Nome de usuário"
            className="dark:border-slate-600 dark:bg-slate-700 border-slate-100 bg-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:w-auto">
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Label
              htmlFor="sort-by"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {t("orderBy")}
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                id="sort-by"
                className="w-full sm:w-45 border-slate-600 bg-slate-200 dark:bg-slate-700"
                aria-label="Ordenar por"
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-slate-300 border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-pointer">
                <SelectItem 
                  value="ultima-visita" 
                  className="focus:bg-slate-200 dark:focus:bg-slate-700 data-[state=checked]:bg-slate-200 dark:data-[state=checked]:bg-slate-700 cursor-pointer"
                >
                  {t("latestVisit")}
                </SelectItem>
                <SelectItem 
                  value="data-inscricao" 
                  className="focus:bg-slate-200 dark:focus:bg-slate-700 data-[state=checked]:bg-slate-200 dark:data-[state=checked]:bg-slate-700 cursor-pointer"
                >
                  {t("dateOfSubscribed")}
                </SelectItem>
                <SelectItem 
                  value="mensagens" 
                  className="focus:bg-slate-200 dark:focus:bg-slate-700 data-[state=checked]:bg-slate-200 dark:data-[state=checked]:bg-slate-700 cursor-pointer"
                >
                  {t("messages")}
                </SelectItem>
                <SelectItem 
                  value="nome-usuario" 
                  className="focus:bg-slate-200 dark:focus:bg-slate-700 data-[state=checked]:bg-slate-200 dark:data-[state=checked]:bg-slate-700 cursor-pointer"
                >
                  {t("nameOfUser")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-37.5 bg-slate-200 dark:bg-slate-700 text-black dark:text-white border-slate-600">
                <SelectValue placeholder="Ordem" />
              </SelectTrigger>
              <SelectContent className="bg-slate-300 border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-pointer">
                <SelectItem 
                  value="decrescente" 
                  className="focus:bg-slate-200 dark:focus:bg-slate-700 data-[state=checked]:bg-slate-200 dark:data-[state=checked]:bg-slate-700 cursor-pointer"
                >
                  {t("descending")}
                </SelectItem>
                <SelectItem 
                  value="crescente" 
                  className="focus:bg-slate-200 dark:focus:bg-slate-700 data-[state=checked]:bg-slate-200 dark:data-[state=checked]:bg-slate-700 cursor-pointer"
                >
                  {t("ascending")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
