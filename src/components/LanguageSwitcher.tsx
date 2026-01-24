"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { routing, Locale } from "@/i18n/routing";

const languageNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    const segments = pathname.split("/");
    if (routing.locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="dark:text-slate-300 text-slate-700 hover:text-blue-500 hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
        >
          <Globe className="h-4 w-4 mr-2" />
          {languageNames[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-100 text-black dark:text-white"
        align="end"
      >
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`cursor-pointer ${
              loc === locale ? "bg-slate-100 dark:bg-slate-700" : ""
            }`}
          >
            {languageNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
