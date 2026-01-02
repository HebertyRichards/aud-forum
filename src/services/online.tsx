"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/services/auth";
import { RawOnlineUser } from "@/schema/forum";

interface WebSocketPayload {
  type: "UPDATE_LIST";
  users: RawOnlineUser[];
}

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
  const [onlineUsers, setOnlineUsers] = useState<RawOnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const auth = useAuth();
  const user = auth?.user;

  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (auth.loading) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const wsBaseUrl = apiUrl?.replace(/^https?/, (match) =>
      match === "https" ? "wss" : "ws"
    );
    const wsUrl = `${wsBaseUrl}/forum/ws/online`;

    let shouldReconnect = true;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connect = () => {
      if (isConnectingRef.current) return;

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      isConnectingRef.current = true;

      try {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          isConnectingRef.current = false;
          reconnectAttempts = 0;
          setIsConnected(true);

          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }

          intervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send("ping");
            }
          }, 60000);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketPayload;

            if (data.type === "UPDATE_LIST" && Array.isArray(data.users)) {
              const validUsers = data.users.filter((u) => {
                return (
                  u &&
                  typeof u === "object" &&
                  u.profiles &&
                  typeof u.profiles === "object" &&
                  u.profiles.username
                );
              });
              setOnlineUsers(validUsers);
            }
          } catch (error) {
            console.error("Erro ao processar mensagem WS:", error);
          }
        };

        ws.onclose = (event) => {
          isConnectingRef.current = false;
          setIsConnected(false);

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          if (shouldReconnect && event.code !== 1000) {
            reconnectAttempts++;
            if (reconnectAttempts <= maxReconnectAttempts) {
              const delay = Math.min(3000 * reconnectAttempts, 30000);
              reconnectTimeoutRef.current = setTimeout(() => {
                if (shouldReconnect) {
                  connect();
                }
              }, delay);
            }
          }
        };

        socketRef.current = ws;
      } catch (error) {
        isConnectingRef.current = false;
        if (shouldReconnect && reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          reconnectTimeoutRef.current = setTimeout(() => {
            if (shouldReconnect) {
              connect();
            }
          }, 3000);
        }
      }
    };

    connect();

    return () => {
      shouldReconnect = false;
      isConnectingRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [user?.username, auth.loading]);

  return (
    <OnlineContext.Provider value={{ onlineUsers, isConnected }}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineUsers = () => useContext(OnlineContext);
