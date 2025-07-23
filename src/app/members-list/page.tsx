import { MembersFilters } from "@/components/Members-filter";
import { MembersTable } from "@/components/Members-table";
export default function MembersList() {
  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">Membros</h1>
          </header>
          <main>
            <MembersFilters />
            <MembersTable />
          </main>
        </div>
      </div>
    </>
  );
}
