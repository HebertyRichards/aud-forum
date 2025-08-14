"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { ForumStatsProps, ProfileData } from "@/types/users";
import Link from "next/link";

export function ForumStats({ stats }: ForumStatsProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [newestMember, setNewestMember] = useState<string>(stats.newestMember);

  useEffect(() => {
    const fetchLastRegisteredUser = async () => {
      try {
        const res = await fetch(`${API_URL}/user/last-registration`);
        if (!res.ok) throw new Error("Erro ao buscar último usuário");
        const data: ProfileData = await res.json();
        setNewestMember(data.username);
      } catch (error: unknown) {}
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
          <Link href={`/profile/${newestMember}`}>
            <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
              {newestMember}
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
