"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/services/auth";
import { RawOnlineUser } from "@/schema/forum";
import { API_URL } from "@/utils/forum-structure";

interface OnlineContextType {
  onlineUsers: RawOnlineUser[];
  isConnected: boolean;
}

interface WebSocketUserProfile {
  username?: unknown;
  role?: unknown;
  avatar_url?: unknown;
}

interface WebSocketUserItem {
  profiles?: WebSocketUserProfile;
  last_seen_at?: unknown;
}

interface WebSocketMessage {
  type: string;
  users: WebSocketUserItem[];
}

const OnlineContext = createContext<OnlineContextType>({
  onlineUsers: [],
  isConnected: false,
});

function isValidWebSocketMessage(data: unknown): data is WebSocketMessage {
  if (typeof data !== "object" || data === null) return false;

  const msg = data as Record<string, unknown>;

  if (typeof msg.type !== "string") return false;

  if (!Array.isArray(msg.users)) return false;

  return true;
}

export function OnlineUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [onlineUsers, setOnlineUsers] = useState<RawOnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const auth = useAuth();
  const user = auth?.user;

  const token =
    user && "access_token" in user && typeof user.access_token === "string"
      ? user.access_token
      : undefined;

  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (auth.loading) return;

    if (user && !token) return;

    const cleanApiUrl = API_URL?.trim().replace(/\/$/, "");
    const isBrowser = typeof window !== "undefined";
    const isHttps = isBrowser && window.location.protocol === "https:";
    const isProduction = process.env.NODE_ENV === "production" || isHttps;

    let wsBaseUrl: string;
    if (cleanApiUrl?.startsWith("https://")) {
      wsBaseUrl = cleanApiUrl.replace(/^https:\/\//, "wss://");
    } else if (cleanApiUrl?.startsWith("http://")) {
      wsBaseUrl = isHttps
        ? `wss://${cleanApiUrl.replace(/^http:\/\//, "")}`
        : cleanApiUrl.replace(/^http:\/\//, "ws://");
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
          }, 30000);
        };

        ws.onmessage = (event) => {
          try {
            const rawData = event.data;
            if (
              !rawData ||
              typeof rawData !== "string" ||
              rawData.trim() === ""
            )
              return;

            const parsed: unknown = JSON.parse(rawData);

            if (isValidWebSocketMessage(parsed)) {
              if (parsed.type !== "UPDATE_LIST") return;

              const validUsers: RawOnlineUser[] = parsed.users
                .map((u): RawOnlineUser | null => {
                  const profiles = u.profiles;
                  if (
                    !profiles ||
                    typeof profiles !== "object" ||
                    typeof profiles.username !== "string" ||
                    !profiles.username
                  ) {
                    return null;
                  }

                  const avatar =
                    typeof profiles.avatar_url === "string"
                      ? profiles.avatar_url
                      : null;
                  const role =
                    typeof profiles.role === "string" ? profiles.role : "user";
                  const lastSeen =
                    typeof u.last_seen_at === "string"
                      ? u.last_seen_at
                      : new Date().toISOString();

                  return {
                    profiles: {
                      username: profiles.username,
                      role: role,
                      avatar_url: avatar,
                    },
                    last_seen_at: lastSeen,
                  };
                })
                .filter((u): u is RawOnlineUser => u !== null);

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
                if (shouldReconnect) connect();
              }, delay);
            }
          }
        };

        socketRef.current = ws;
      } catch (error) {
        console.error(error);
        isConnectingRef.current = false;
        if (shouldReconnect && reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }
      }
    };

    connect();

    return () => {
      shouldReconnect = false;
      isConnectingRef.current = false;
      isIntentionallyClosing = true;

      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close(1000, "Unmount");
        socketRef.current = null;
      }
    };
  }, [user?.username, auth.loading, token]);

  return (
    <OnlineContext.Provider value={{ onlineUsers, isConnected }}>
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineUsers = () => useContext(OnlineContext);
