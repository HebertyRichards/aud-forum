"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { forumStructure } from "@/utils/forum-structure";

export function ForumCategoryList() {
  const defaultOpenCategories = forumStructure.map((category) => category.id);

  return (
    <div className="w-full">
      <Accordion
        type="multiple"
        defaultValue={defaultOpenCategories}
        className="space-y-6"
      >
        {forumStructure.map((category) => (
          <AccordionItem
            key={category.id}
            value={category.id}
            className="border-none rounded-md overflow-hidden shadow-md bg-gray-800/50"
          >
            <AccordionTrigger className="bg-blue-700 px-4 py-2 text-base font-semibold hover:no-underline hover:brightness-110 w-full">
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
                    <item.icon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-semibold text-white">
                      {item.title}
                    </span>
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
