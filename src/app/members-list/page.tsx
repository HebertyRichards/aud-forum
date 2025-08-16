"use client";

import { MembersFilters } from "@/components/members-list/Members-filter";
import { MembersTable } from "@/components/members-list/Members-table";
import { getAllMembers } from "@/services/member";
import { Member } from "@/types/users";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export default function MembersList() {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const usersPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("ultima-visita");
  const [sortOrder, setSortOrder] = useState("decrescente");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const { members, totalCount } = await getAllMembers(currentPage);
        setAllMembers(members);
        setTotalCount(totalCount);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu uma falha inesperada.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [currentPage]);

  const filteredMembers = useMemo(() => {
    let members = [...allMembers];

    if (searchTerm) {
      members = members.filter((member) =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
          break;
      }
      return sortOrder === "crescente" ? compareResult : -compareResult;
    });

    return members;
  }, [allMembers, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(totalCount / usersPerPage);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Membros</h1>
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
          <div className="mt-6 flex justify-center items-center gap-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages > 0 ? totalPages : 1}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={
                currentPage === totalPages || isLoading || totalPages === 0
              }
            >
              Próxima
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
