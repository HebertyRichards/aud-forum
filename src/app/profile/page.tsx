// app/perfil/page.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, UserX } from "lucide-react";

const userData = {
  username: "AizeN_Auditore",
  messages: 111,
  birthDate: "5/06/2004",
  joinDate: "06/05/2020",
  age: 21,
  location: "Recife - PE",
  rank: "Fundador",
  avatarUrl: "https://github.com/shadcn.png",
};

export default function Profile() {
  return (
    <div className="min-h-screen font-sans">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-4">
              Tudo sobre {userData.username}
            </h1>
            <Tabs defaultValue="perfil" className="w-full">
              <TabsList className="border border-gray-700 bg-white dark:bg-gray-800">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
                <TabsTrigger value="amigos">Amigos</TabsTrigger>
                <TabsTrigger value="grupos">Grupos</TabsTrigger>
                <TabsTrigger value="contato">Contato</TabsTrigger>
              </TabsList>

              <TabsContent value="perfil" className="mt-4">
                <Card className="border-gray-700 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Sobre</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Gênero:</span>
                      <span>--</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Mensagens:</span>
                      <span>{userData.messages}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Data de nascimento:</span>
                      <span>{userData.birthDate}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Data de inscrição:</span>
                      <span>{userData.joinDate}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Idade:</span>
                      <span>{userData.age}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Localização:</span>
                      <span>{userData.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <aside className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-blue-400">
              <a href="#" className="hover:underline flex items-center gap-1">
                <UserPlus size={16} /> Adicionar amigo(a)
              </a>
              <a href="#" className="hover:underline flex items-center gap-1">
                <UserX size={16} /> Adicionar como ignorado(a)
              </a>
            </div>
            <Card className="border-gray-700 text-center bg-white dark:bg-gray-800">
              <CardContent className="p-6 flex flex-col items-center">
                <h2 className="text-xl font-bold text-blue-400 hover:underline cursor-pointer mb-4">
                  {userData.username}
                </h2>
                <Avatar className="w-24 h-24 mb-4 border-2 border-gray-500">
                  <AvatarImage
                    src={userData.avatarUrl}
                    alt={userData.username}
                  />
                  <AvatarFallback>{userData.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 w-full mb-4">
                  Seguir
                </Button>
                <div className="text-sm">
                  <span className="font-semibold">Rank: </span>
                  <span className="text-yellow-400 font-bold">
                    {userData.rank}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-base">
                  Amigo(a)s de {userData.username}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Nenhum amigo para mostrar.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
