"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { forumStructure } from "@/utils/forum-structure";
import { useAuth } from "@/services/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function ForumCategoryList() {
  const auth = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userId = auth.user?.id;
    if (!userId) {
      setUserRole(null);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/${userId}`);
        if (res.ok) {
          const profileData = await res.json();
          setUserRole(profileData.role);
        } else {
          setUserRole(null);
        }
      } catch {
        setUserRole(null);
      }
    };

    fetchUserProfile();
  }, [auth.user?.id]);

  const allowedRolesForHiddenArea = ["Membro", "Desenvolvedor", "Fundador"];

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
            className="border-none rounded-md overflow-hidden shadow-md bg-white dark:bg-gray-800"
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
