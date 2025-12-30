"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
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
  const [onlineUsers, setOnlineUsers] = useState<RawOnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
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
              const validUsers = data.users.filter((user) => {
                return (
                  user &&
                  typeof user === "object" &&
                  user.profiles &&
                  typeof user.profiles === "object" &&
                  user.profiles.username &&
                  typeof user.profiles.username === "string"
                );
              });
              setOnlineUsers(validUsers);
            }
          } catch (error) {
            console.error("Erro ao processar: ", error);
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
        console.error("Erro ao criar WebSocket:", error);

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
  }, []);

  return (
    <OnlineContext.Provider value={{ onlineUsers, isConnected }}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineUsers = () => useContext(OnlineContext);
