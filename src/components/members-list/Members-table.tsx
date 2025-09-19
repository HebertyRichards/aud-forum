import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MembersTableProps } from "@/types/users";
import { formatLastLogin, formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { getRoleColor } from "@/utils/colors";
import { useAuth } from "@/services/auth";

export function MembersTable({ members, isLoading, error }: MembersTableProps) {
  const { user } = useAuth();

  if (isLoading) {
    return <div className="text-center mt-10">Carregando membros...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (members.length === 0) {
    return <div className="text-center mt-10">Nenhum membro encontrado.</div>;
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-800 overflow-x-auto border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 hover:bg-slate-800">
            <TableHead className="w-[50px] text-white">#</TableHead>
            <TableHead className="min-w-[200px] text-white">
              Avatar - Nome de usuário
            </TableHead>
            <TableHead className="text-white">Data de inscrição</TableHead>
            <TableHead className="hidden md:table-cell text-white">
              Última visita
            </TableHead>
            <TableHead className="hidden md:table-cell text-white">
              Mensagens
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => {
            const isOwnProfile = user?.username === member.username;
            const profileHref = isOwnProfile
              ? "/profile"
              : `/profile/${member.username}`;

            return (
              <TableRow key={member.username} className="border-slate-700">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={member.avatar_url || undefined}
                        alt={`Avatar de ${member.username}`}
                      />
                      <AvatarFallback>
                        {member.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Link href={profileHref} className="hover:underline">
                      <span
                        className={`font-semibold ${getRoleColor(member.role)}`}
                      >
                        {member.username}
                      </span>
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{formatDate(member.joined_at)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatLastLogin(member.last_login)}
                </TableCell>
                <TableCell className="hidden md:table-cell font-medium">
                  {member.messages}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
