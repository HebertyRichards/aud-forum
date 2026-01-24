"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryDetailsMap } from "@/utils/utilities";
import { useCategory } from "@/hooks/useCategory";
import { Folder, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type ApiCategory = {
  slug: string;
  name: string;
  description?: string;
}

export default function TopicsIndexPage() {
  const { data, isLoading, error } = useCategory();
  const t = useTranslations("pages.topicsIndex");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md dark:bg-slate-800 dark:text-white bg-slate-200 text-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              {t("loading")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if(error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md dark:bg-slate-800 dark:text-white bg-slate-200 text-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              {t("error")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const categories: ApiCategory[] = data || [];

  if (categories.length === 0) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl dark:bg-slate-800 dark:text-white bg-slate-200 text-black">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-500" />
                {t("categories")}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
            <p className="text-center text-muted-foreground text-lg">
              {t("empty")}
            </p>
            <Button variant="outline" asChild>
              <Link href="/">{t("backHome")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <Button
            asChild
            variant="outline"
            className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:text-white bg-slate-200 border-slate-200 hover:bg-slate-100 hover:text-black"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backHome")}
            </Link>
          </Button>
          <div className="grow text-center">
            <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
            <p className="dark:text-gray-300 text-gray-700">
              {t("description")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryInfo = categoryDetailsMap[category.slug];
            const categoryIcon = categoryInfo?.icon || (
              <Folder className="h-5 w-5" />
            );
            const categoryDescription = category.description ?? '';

            return (
              <Link
                key={category.slug}
                href={`/topics/${category.slug}`}
                className="group block h-full"
              >
                <Card className="dark:bg-slate-800 dark:border-slate-800 bg-slate-200 border-slate-200 dark:hover:border-blue-500 dark:hover:ring-1 dark:hover:ring-blue-500 transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg dark:bg-slate-700 bg-slate-100 text-blue-500 group-hover:text-blue-600 group-hover:scale-110 transition-transform">
                        {categoryIcon}
                      </div>
                      <h3 className="font-bold text-lg leading-tight dark:text-white group-hover:text-blue-500 transition-colors">
                        {category.name}
                      </h3>
                    </div>

                    <p className="text-sm dark:text-gray-300 text-gray-700 grow line-clamp-3">
                      {categoryDescription}
                    </p>

                    <div className="mt-6 flex justify-end items-center text-xs font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                      {t("access")}
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}