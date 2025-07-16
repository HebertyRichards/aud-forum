import Link from "next/link";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Auditore</h3>
                <p className="text-sm text-gray-600">since 2020</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Uma das famílias mais respeitadas do SA-MP, construindo legado e
              tradição há mais de 4 anos.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Fórum Completo
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Lista de Membros
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Regras da Família
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
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
                  href="/category/avisos"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Avisos da Liderança
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Discussões Gerais
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Eventos & Atividades
                </Link>
              </li>
              <li>
                <Link
                  href="/category/galeria"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Galeria
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Suporte & Dúvidas
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
            <Link href="#" className="hover:text-gray-700 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="hover:text-gray-700 transition-colors">
              Termos de Uso
            </Link>
            <span>|</span>
            <span>
              Desenvolvido por{" "}
              <span className="font-medium text-blue-600">HebertyRichards</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
