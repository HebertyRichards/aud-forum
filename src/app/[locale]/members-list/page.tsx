"use client";

import { useMemo, useState } from "react";
import { MembersFilters } from "@/components/members-list/Members-filter";
import { MembersTable } from "@/components/members-list/Members-table";
import { PaginationControls } from "@/components/PaginationControls";
import { useMembers } from "@/hooks/useMembers";
import { useTranslations } from "next-intl";

export default function MembersList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("ultima-visita");
  const [sortOrder, setSortOrder] = useState("decrescente");
  const usersPerPage = 20;
  const t = useTranslations("pages.membersList");

  const { data, isLoading, error } = useMembers(currentPage);

  const filteredMembers = useMemo(() => {
    const membersToSort = [...(data?.members || [])];

    if (searchTerm) {
      return membersToSort.filter((member) =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return membersToSort.sort((a, b) => {
      let compareResult = 0;
      switch (sortBy) {
        case "nome-usuario":
          compareResult = a.username.localeCompare(b.username);
          break;
        case "data-inscricao":
          const aJoined = a.joined_at ? new Date(a.joined_at).getTime() : 0;
          const bJoined = b.joined_at ? new Date(b.joined_at).getTime() : 0;
          compareResult = aJoined - bJoined;
          break;
        case "mensagens":
          compareResult = a.messages - b.messages;
          break;
        case "ultima-visita":
        default:
          const aTime = a.last_login ? new Date(a.last_login).getTime() : 0;
          const bTime = b.last_login ? new Date(b.last_login).getTime() : 0;
          compareResult = bTime - aTime;
          break;
      }
      return sortOrder === "crescente" ? compareResult : -compareResult;
    });
  }, [data?.members, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil((data?.totalCount || 0) / usersPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
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
            error={error ? (error as Error).message : null}
          />
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
