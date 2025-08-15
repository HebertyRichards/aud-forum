import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { MembersTableProps } from "@/types/users";
import { formatLastLogin, formatJoinDate } from "@/utils/dateUtils";
import Link from "next/link";

export function MembersTable({ members, isLoading, error }: MembersTableProps) {
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
    <div className="mt-6 rounded-md border bg-white dark:bg-gray-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="min-w-[200px]">
              Avatar - Nome de usuário
            </TableHead>
            <TableHead>Data de inscrição</TableHead>
            <TableHead>Última visita</TableHead>
            <TableHead>Mensagens</TableHead>
            <TableHead className="text-center">MP</TableHead>
            <TableHead className="text-center">Web site</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.username} />
                    <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/profile/${member.username}`}
                    className="hover:underline"
                  >
                    <span
                      className={cn("font-semibold", {
                        "text-green-600": member.role === "Visitante",
                        "text-orange-500": member.role === "Partner",
                        "text-blue-500": member.role === "Membro",
                        "text-pink-600": member.role === "Leader",
                        "text-red-500": member.role === "Fundador",
                        "text-yellow-500": member.role === "Desenvolvedor",
                      })}
                    >
                      {member.username}
                    </span>
                  </Link>
                </div>
              </TableCell>
              <TableCell>{formatJoinDate(member.joinDate)}</TableCell>
              <TableCell>{formatLastLogin(member.lastVisit)}</TableCell>
              <TableCell className="font-medium">{member.messages}</TableCell>
              <TableCell className="text-center">
                {member.hasPrivateMessage && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
              <TableCell className="text-center">
                {member.hasWebsite && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Globe className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
