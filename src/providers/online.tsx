"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth";
import { RawOnlineUser } from "@/schema/forum";
import { supabase } from "@/lib/supabase";

type OnlineContextType = {
  onlineUsers: RawOnlineUser[];
  isConnected: boolean;
};

type PresenceState = {
  username: string;
  role: string;
  avatar_url: string | null;
  online_at: string;
};

const OnlineContext = createContext<OnlineContextType>({
  onlineUsers: [],
  isConnected: false,
});

export function OnlineUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [onlineUsers, setOnlineUsers] = useState<RawOnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const auth = useAuth();
  const user = auth?.user;

  useEffect(() => {
    const channel = supabase.channel("forum_online_presence");

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState<PresenceState>();
        const uniqueUsers = new Map<string, RawOnlineUser>();

        for (const key in newState) {
          const presenceList = newState[key];
          
          if (presenceList && presenceList.length > 0) {
            presenceList.forEach(presenceData => {
              const existingUser = uniqueUsers.get(presenceData.username);
              
              if (!existingUser || new Date(presenceData.online_at) > new Date(existingUser.last_seen_at)) {
                uniqueUsers.set(presenceData.username, {
                  profiles: {
                    username: presenceData.username,
                    role: presenceData.role,
                    avatar_url: presenceData.avatar_url,
                  },
                  last_seen_at: presenceData.online_at,
                });
              }
            });
          }
        }

        setOnlineUsers(Array.from(uniqueUsers.values()));
        setIsConnected(true);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);

          if (user) {
            await channel.track({
              username: user.username,
              role: user.role || "Visitante",
              avatar_url: user.avatarUrl || null,
              online_at: new Date().toISOString(),
            });
          }
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return (
    <OnlineContext.Provider value={{ onlineUsers, isConnected }}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineUsers = () => useContext(OnlineContext);