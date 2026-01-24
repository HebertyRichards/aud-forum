import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatLastLogin, formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { getRoleColor } from "@/utils/colors";
import { useAuth } from "@/providers/auth";
import { Member } from "@/schema/forum";
import { useTranslations } from "next-intl";

type MembersTableProps = {
  members: Member[];
  isLoading: boolean;
  error: string | null;
};

export function MembersTable({ members, isLoading, error }: MembersTableProps) {
  const { user } = useAuth();
  const t = useTranslations("forum");
  const tCommon = useTranslations("common");

  if (isLoading) {
    return <div className="text-center mt-10">{tCommon("loading")}</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (members.length === 0) {
    return <div className="text-center mt-10">{t("noMembersFound")}</div>;
  }

  return (
    <div className="mt-6 rounded-md border dark:bg-slate-800 bg-slate-200 overflow-x-auto dark:border-slate-700 border-slate-100">
      <Table>
        <TableHeader>
          <TableRow className="dark:border-slate-700 border-slate-100 dark:hover:bg-slate-800 hover:bg-slate-200">
            <TableHead className="w-12.5">#</TableHead>
            <TableHead className="min-w-50">
              {t("avatarOfNameOfUser")}
            </TableHead>
            <TableHead>{t("dateOfSubscribed")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("latestVisit")}
            </TableHead>
            <TableHead className="hidden md:table-cell">
              {t("messages")}
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
              <TableRow
                key={member.username}
                className="dark:border-slate-700 border-slate-100 dark:hover:bg-slate-800 hover:bg-slate-200 text-black dark:text-white"
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={member.avatar_url || undefined}
                        alt={`Avatar de ${member.username}`}
                      />
                      <AvatarFallback className="dark:bg-slate-600 bg-slate-100">
                        {member.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Link href={profileHref} className="hover:underline">
                      <span
                        className={`truncate font-semibold ${getRoleColor(
                          member.role
                        )}`}
                      >
                        {member.username}
                      </span>
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{formatDate(member.joined_at)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatLastLogin(member.last_login ?? null)}
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
