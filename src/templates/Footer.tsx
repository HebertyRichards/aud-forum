import Link from "next/link";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t mt-12 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/header.png"
                  alt="Footer Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </Link>
              <div>
                <h3 className="text-xl font-bold">Auditore</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  since 2020
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Uma das famílias mais respeitadas do SA-MP, construindo legado e
              tradição há mais de 5 anos.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link
                  href="/members-list"
                  className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Lista de Membros
                </Link>
              </li>
              <li>
                <Link
                  href="/topics"
                  className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Categorias
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/subscribe"
                  className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Recrutamento
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/topics/downloads"
                  className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Downloads
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/general-discussions"
                  className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Discussões Gerais
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  História da Família
                </Link>
              </li>
              <li>
                <Link
                  href="/topics/manuals"
                  className="text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Manuais
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            <p>&copy; 2025 Auditore. Todos os direitos reservados.</p>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>
              Desenvolvido por{" "}
              <span className="font-bold text-blue-700 dark:text-blue-500">
                HebertyRichards
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
