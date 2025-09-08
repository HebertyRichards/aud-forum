"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/types/profile";
import { MainStats } from "@/types/users";
import { getRoleColor } from "@/utils/colors";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const fetchAllData = async () => {
  try {
    const [statsRes, newestMemberRes] = await Promise.all([
      fetch(`/api/forum/stats`),
      fetch(`/api/user/last-registration`),
    ]);

    const statsData = statsRes.ok ? await statsRes.json() : null;
    const newestMemberData = newestMemberRes.ok
      ? await newestMemberRes.json()
      : null;

    return {
      stats: statsData as MainStats,
      newestMember: newestMemberData as UserProfile,
    };
  } catch {
    throw new Error("Erro ao carregar estatísticas.");
  }
};

export function ForumStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["forumStats"],
    queryFn: fetchAllData,
  });

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Membros</span>
          <span className="font-semibold">
            {data?.stats?.activeMembers ?? "..."}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Posts Totais</span>
          <span className="font-semibold">
            {data?.stats?.totalPosts ?? "..."}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tópicos Totais</span>
          <span className="font-semibold">
            {data?.stats?.totalTopics ?? "..."}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Novo Membro</span>
          {data?.newestMember ? (
            <Link href={`/profile/${data.newestMember.username}`}>
              <span
                className={`font-semibold hover:underline cursor-pointer ${getRoleColor(
                  data.newestMember.role
                )}`}
              >
                {data.newestMember.username}
              </span>
            </Link>
          ) : (
            <span className="font-semibold">Nenhum</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
