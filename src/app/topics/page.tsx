"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ApiCategory } from "@/types/post";
import { Button } from "@/components/ui/button";
import { categoryDetailsMap } from "@/utils/utilities";
import { useCategory } from "@/hooks/useCategory";
import { Folder, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";

export default function TopicsIndexPage() {
  const { data, isLoading, error } = useCategory();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              Carregando categorias...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if(error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              Ocorreu um erro ao carregar as categorias.
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
        <Card className="w-full max-w-2xl bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-500" />
                Categorias
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
            <p className="text-center text-muted-foreground text-lg">
              Nenhuma categoria encontrada no momento.
            </p>
            <Button variant="outline" asChild>
              <Link href="/">Voltar ao Início</Link>
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
            className="text-white bg-slate-800 hover:bg-slate-700 border-slate-700 hover:text-white"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Início
            </Link>
          </Button>
          <div className="grow text-center">
            <h1 className="text-4xl font-bold mb-2 text-white">Fóruns</h1>
            <p className="text-gray-400">
              Navegue pelas categorias para encontrar o que procura.
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
                <Card className="bg-slate-800 border-slate-800 hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all duration-300 h-full text-white">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-blue-500 group-hover:text-blue-600 group-hover:scale-110 transition-transform">
                        {categoryIcon}
                      </div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-blue-500 transition-colors">
                        {category.name}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-400 grow line-clamp-3">
                      {categoryDescription}
                    </p>

                    <div className="mt-6 flex justify-end items-center text-xs font-medium text-gray-500 group-hover:text-blue-500 transition-colors">
                      Acessar categoria
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
