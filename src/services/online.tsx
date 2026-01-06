"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/services/auth";
import { RawOnlineUser } from "@/schema/forum";

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

  const token = user?.access_token;

  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (auth.loading) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("API não configurada");
      return;
    }

    const cleanApiUrl = apiUrl?.trim().replace(/\/$/, "");

    const isBrowser = typeof window !== "undefined";
    const isHttps = isBrowser && window.location.protocol === "https:";
    const isProduction = process.env.NODE_ENV === "production" || isHttps;

    let wsBaseUrl: string;
    if (cleanApiUrl.startsWith("https://")) {
      wsBaseUrl = cleanApiUrl.replace(/^https:\/\//, "wss://");
    } else if (cleanApiUrl.startsWith("http://")) {
      if (isHttps) {
        const hostname = cleanApiUrl.replace(/^http:\/\//, "");
        wsBaseUrl = `wss://${hostname}`;
      } else {
        wsBaseUrl = cleanApiUrl.replace(/^http:\/\//, "ws://");
      }
    } else {
      wsBaseUrl =
        isProduction || isHttps
          ? `wss://${cleanApiUrl}`
          : `ws://${cleanApiUrl}`;
    }

    let wsUrl = `${wsBaseUrl}/forum/ws/online`;

    if (token) {
      wsUrl += `?token=${token}`;
    }

    let shouldReconnect = true;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let isIntentionallyClosing = false;

    const connect = () => {
      if (isConnectingRef.current) return;

      if (socketRef.current) {
        isIntentionallyClosing = true;
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
        isIntentionallyClosing = false;
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
            const rawData = event.data;

            if (!rawData || rawData.trim() === "") return;
            const parsed = JSON.parse(rawData);

            if (
              typeof parsed === "object" &&
              parsed !== null &&
              "type" in parsed &&
              parsed.type === "UPDATE_LIST"
            ) {
              if (!("users" in parsed)) return;

              if (!Array.isArray(parsed.users)) return;

              const validUsers: RawOnlineUser[] = parsed.users
                .map((u: unknown): RawOnlineUser | null => {
                  if (
                    typeof u !== "object" ||
                    u === null ||
                    !("profiles" in u) ||
                    typeof u.profiles !== "object" ||
                    u.profiles === null ||
                    !("username" in u.profiles) ||
                    typeof u.profiles.username !== "string" ||
                    u.profiles.username.trim() === ""
                  )
                    return null;

                  const user = u as Partial<RawOnlineUser>;
                  const lastSeenAt =
                    user.last_seen_at || new Date().toISOString();

                  return {
                    ...(u as RawOnlineUser),
                    last_seen_at: lastSeenAt,
                  };
                })
                .filter(
                  (u: RawOnlineUser | null): u is RawOnlineUser => u !== null
                );
              setOnlineUsers(validUsers);
            }
          } catch (error) {
            console.error(error);
          }
        };

        ws.onerror = (error) => {
          console.error(error);
          isConnectingRef.current = false;
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          isConnectingRef.current = false;
          setIsConnected(false);

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          if (
            shouldReconnect &&
            !isIntentionallyClosing &&
            event.code !== 1000
          ) {
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
      isIntentionallyClosing = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        socketRef.current.onmessage = null;
        socketRef.current.onopen = null;
        socketRef.current.close(1000, "Component unmounting");
        socketRef.current = null;
      }
      isIntentionallyClosing = false;
    };
  }, [user?.username, auth.loading, token]);

  return (
    <OnlineContext.Provider value={{ onlineUsers, isConnected }}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineUsers = () => useContext(OnlineContext);
