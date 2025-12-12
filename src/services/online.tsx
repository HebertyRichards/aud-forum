"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/services/auth";
import { RawOnlineUser, WebSocketPayload } from "@/types/users";

interface OnlineContextType {
  onlineUsers: RawOnlineUser[];
  isConnected: boolean;
}

const OnlineContext = createContext<OnlineContextType>({
  onlineUsers: [],
  isConnected: false,
});

export function OnlineUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [onlineUsers, setOnlineUsers] = useState<RawOnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) {
      setOnlineUsers([]);
      setIsConnected(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const wsBaseUrl = apiUrl?.replace(/^http/, "ws");
    const wsUrl = `${wsBaseUrl}/forum/ws/online`;

    const connect = () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("🟢 WS: Conectado");
        setIsConnected(true);

        intervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send("ping");
        }, 60000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketPayload;
          if (data.type === "UPDATE_LIST" && Array.isArray(data.users)) {
            setOnlineUsers(data.users);
          }
        } catch (error) {
          console.error("Erro WS:", error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };

      ws.onerror = () => {
        ws.close();
      };

      socketRef.current = ws;
    };

    connect();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [user]);

  return (
    <OnlineContext.Provider value={{ onlineUsers, isConnected }}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineUsers = () => useContext(OnlineContext);
