"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { forumStructure } from "@/utils/forum-structure";
import { useAuth } from "@/services/auth";
import axios from "axios";
import { UserProfile } from "@/types/profile";

const fetchUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const { data } = await axios.get(`/api/profile/${userId}`);
    return data;
  } catch {
    return null;
  }
};

export function ForumCategoryList() {
  const auth = useAuth();
  const userId = auth.user?.id;

  const { data: userProfile } = useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });

  const userRole = userProfile?.role;
  const allowedRolesForHiddenArea = [
    "Leader",
    "Desenvolvedor",
    "Fundador",
    "Auditore",
  ];

  const filteredForumStructure = forumStructure.filter((category) => {
    if (category.id !== "area-oculta") {
      return true;
    }
    return userRole && allowedRolesForHiddenArea.includes(userRole);
  });

  const defaultOpenCategories = filteredForumStructure.map(
    (category) => category.id
  );

  return (
    <div className="w-full">
      <Accordion
        type="multiple"
        defaultValue={defaultOpenCategories}
        className="space-y-6"
      >
        {filteredForumStructure.map((category) => (
          <AccordionItem
            key={category.id}
            value={category.id}
            className="border-none rounded-md overflow-hidden shadow-md bg-white dark:bg-slate-800"
          >
            <AccordionTrigger className="bg-blue-700 px-4 py-2 text-base font-semibold hover:no-underline hover:brightness-110 w-full, dark:bg-blue-500">
              {category.title}
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="divide-y divide-gray-700">
                {category.subItems.map((item) => (
                  <Link
                    href={item.href}
                    key={item.title}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-semibold">{item.title}</span>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
