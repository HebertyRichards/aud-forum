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
import { members } from "@/utils/data";
import { cn } from "@/lib/utils";

export function MembersTable() {
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
                  <span
                    className={cn("font-semibold", {
                      "text-red-600": member.role === "leader",
                      "text-orange-500": member.role === "auditore",
                      "text-blue-600": member.role === "default",
                    })}
                  >
                    {member.username}
                  </span>
                </div>
              </TableCell>
              <TableCell>{member.joinDate}</TableCell>
              <TableCell>{member.lastVisit}</TableCell>
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
