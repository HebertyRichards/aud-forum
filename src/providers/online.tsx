"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "@/providers/auth";
import { RawOnlineUser } from "@/schema/forum";
import { OnlineService } from "@/services/onlineService";

type OnlineContextType = {
  onlineUsers: RawOnlineUser[];
  isConnected: boolean;
  onlineCount: number;
  usernames: string[];
};

const OnlineContext = createContext<OnlineContextType>({
  onlineUsers: [],
  isConnected: false,
  onlineCount: 0,
  usernames: [],
});

export function OnlineUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [onlineUsers, setOnlineUsers] = useState<RawOnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const serviceRef = useRef<OnlineService | null>(null);
  
  const auth = useAuth();
  const user = auth?.user;

  const onlineCount = onlineUsers.length;
  const usernames = onlineUsers.map(u => u.profiles.username);

  useEffect(() => {
    const service = new OnlineService(user || null);
    serviceRef.current = service;
 
    service.connect(
      (users) => {
        setOnlineUsers(users);
      },
      (connected) => {
        setIsConnected(connected); 
      }
    );
 
    return () => {
      serviceRef.current?.disconnect();
      serviceRef.current = null;
    };
  }, [user]);

  useEffect(() => {
    if (serviceRef.current) {
      serviceRef.current.updateUser(user ?? null);
    }
  }, [user]);

  return (
    <OnlineContext.Provider value={{ onlineUsers, isConnected, onlineCount, usernames }}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineUsers = () => useContext(OnlineContext);