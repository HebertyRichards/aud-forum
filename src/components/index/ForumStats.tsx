"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/profile";
import Link from "next/link";
import { ForumStatsProps } from "@/types/users";
import { getRoleColor } from "@/utils/colors";

export function ForumStats({ stats }: ForumStatsProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [newestMember, setNewestMember] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchLastRegisteredUser = async () => {
      try {
        const res = await fetch(`${API_URL}/user/last-registration`);
        if (!res.ok) throw new Error("Erro ao buscar último usuário");
        const data: UserProfile = await res.json();
        setNewestMember(data);
      } catch {}
    };

    fetchLastRegisteredUser();
  }, [API_URL]);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Membros Ativos</span>
          <span className="font-semibold">{stats.activeMembers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Posts Totais</span>
          <span className="font-semibold">{stats.totalPosts}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tópicos Totais</span>
          <span className="font-semibold">{stats.totalTopics}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Novo Membro</span>
          {newestMember ? (
            <Link href={`/profile/${newestMember.username}`}>
              <span
                className={`font-semibold hover:underline cursor-pointer ${getRoleColor(
                  newestMember.role
                )}`}
              >
                {newestMember.username}
              </span>
            </Link>
          ) : (
            <span className="font-semibold">{stats.newestMember}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
