"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { forumStructure } from "@/utils/forum-structure";
import { RolesAuthorizedSchema } from "@/schema/user";
import { useSearchUserProfile } from "@/hooks/useSearchUserProfile";

export function ForumCategoryList() {
  const { data: userProfile } = useSearchUserProfile();

  const filteredForumStructure = forumStructure.filter((category) => {
    if (category.id !== "area-oculta") {
      return true;
    }

    return RolesAuthorizedSchema.safeParse(userProfile?.role).success;
  });

  const defaultOpenCategories = filteredForumStructure.map(
    (category) => category.id
  );

  return (
    <div className="w-full text-white">
      <Accordion
        type="multiple"
        defaultValue={defaultOpenCategories}
        className="space-y-6"
      >
        {filteredForumStructure.map((category) => (
          <AccordionItem
            key={category.id}
            value={category.id}
            className="border-none rounded-md overflow-hidden shadow-md bg-slate-800"
          >
            <AccordionTrigger className="px-4 py-2 text-base font-semibold hover:no-underline hover:brightness-110 w-full bg-blue-500">
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
