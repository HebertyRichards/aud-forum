import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { OnlineUser } from "@/utils/forum-data";

interface OnlineUsersProps {
  users: OnlineUser[];
}

export function OnlineUsers({ users }: OnlineUsersProps) {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Usuários Online</span>
          <Badge variant="secondary" className="ml-auto">
            {users.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="relative">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    user.status === "online" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
              </div>
              <span className="text-sm font-medium hover:underline cursor-pointer">
                {user.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
