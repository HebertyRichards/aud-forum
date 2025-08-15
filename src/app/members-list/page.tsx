// src/app/members/page.tsx

"use client";

import { MembersFilters } from "@/components/Members-filter";
import { MembersTable } from "@/components/Members-table";
import { getAllMembers } from "@/services/member";
import { Member } from "@/types/users";
import { useEffect, useMemo, useState } from "react";

export default function MembersList() {
  // Estado original com todos os membros
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- NOVOS ESTADOS PARA OS FILTROS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("ultima-visita"); // Valor padrão do Select
  const [sortOrder, setSortOrder] = useState("decrescente"); // Valor padrão do Select

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const fetchedMembers = await getAllMembers();
        setAllMembers(fetchedMembers);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro desconhecido.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // --- LÓGICA PARA FILTRAR E ORDENAR OS MEMBROS ---
  const filteredMembers = useMemo(() => {
    let members = [...allMembers];

    // 1. Lógica de Filtragem (pelo nome de usuário)
    if (searchTerm) {
      members = members.filter((member) =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Lógica de Ordenação
    members.sort((a, b) => {
      let compareResult = 0;
      switch (sortBy) {
        case "nome-usuario":
          compareResult = a.username.localeCompare(b.username);
          break;
        case "data-inscricao":
          compareResult =
            new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case "mensagens":
          compareResult = a.messages - b.messages;
          break;
        case "ultima-visita":
        default:
          compareResult =
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime(); // Note: datas são strings, precisam ser convertidas
          break;
      }
      return sortOrder === "crescente" ? compareResult : -compareResult;
    });

    return members;
  }, [allMembers, searchTerm, sortBy, sortOrder]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Membros</h1>
        </header>
        <main>
          <MembersFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <MembersTable
            members={filteredMembers}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
}
