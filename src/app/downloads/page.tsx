import { DownloadCard } from "@/components/download/download-card";
import { Car, Music, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Downloads() {
  return (
    <div className="min-h-screen text-gray-300 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Downloads</h1>
          <div className="flex gap-2">
            <Button variant="ghost" className="hover:bg-gray-700">
              <Search className="h-4 w-4 mr-2" />
              Procurar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Tópico
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-400 mb-6">
          <a href="#" className="hover:underline">
            Família Auditore
          </a>
          <span className="mx-2">&gt;</span>
          <a href="#" className="hover:underline">
            Informações Gerais
          </a>
          <span className="mx-2">&gt;</span>
          <span>Downloads</span>
        </div>
        <div className="space-y-3">
          <DownloadCard
            icon={<Car size={32} />}
            title="Menu de Carros"
            author="AizeN_Auditore"
            postDate="Sex, 26 Jul 2024 - 15:42"
            replies={175}
            views={2349}
          />
          <DownloadCard
            icon={<Music size={32} />}
            title="Pack de Sons para Viaturas"
            author="voyna"
            postDate="Qua, 24 Jul 2024 - 11:03"
            replies={98}
            views={1821}
          />
          <DownloadCard
            icon={<Car size={32} />}
            title="Speedometer Realista v2.1"
            author="Heber"
            postDate="Seg, 22 Jul 2024 - 09:17"
            replies={312}
            views={4500}
          />
        </div>
      </div>
    </div>
  );
}
