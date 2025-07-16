"use client"; // Necessário se estiver usando Next.js 13+ (App Router)

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openNav = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-2xl font-bold">Auditore</h1>
            <Badge variant="secondary">Família</Badge>
          </div>
          <button
            onClick={openNav}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Abrir menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t">
          <div className="px-2 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Início
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Fórum
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Membros
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Regras
            </Link>
            <hr className="my-2" />
            <div className="flex items-center space-x-2 px-3">
              <Button variant="outline" className="w-full">
                Registar
              </Button>
              <Button className="w-full">Registrar</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
