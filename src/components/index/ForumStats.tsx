"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/profile";
import { MainStats } from "@/types/users";
import { getRoleColor } from "@/utils/colors";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function ForumStats() {
  const [stats, setStats] = useState<MainStats | null>(null);
  const [newestMember, setNewestMember] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [statsRes, newestMemberRes] = await Promise.all([
          fetch(`/api/forum/stats`),
          fetch(`/api/user/last-registration`),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (newestMemberRes.ok) {
          const newestMemberData = await newestMemberRes.json();
          setNewestMember(newestMemberData);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
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
          <span className="font-semibold">{stats?.activeMembers ?? "..."}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Posts Totais</span>
          <span className="font-semibold">{stats?.totalPosts ?? "..."}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tópicos Totais</span>
          <span className="font-semibold">{stats?.totalTopics ?? "..."}</span>
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
            <span className="font-semibold">Nenhum</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
