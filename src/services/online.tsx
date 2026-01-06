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
      console.error(
        "[WS] NEXT_PUBLIC_API_URL não está definida. WebSocket não será conectado."
      );
      return;
    }

    const cleanApiUrl = apiUrl.trim().replace(/\/$/, "");

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
    console.log("[WS] Configuração:", {
      apiUrl: cleanApiUrl,
      wsUrl,
      isProduction,
      isHttps,
      nodeEnv: process.env.NODE_ENV,
    });

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
          console.log("[WS] ✅ Conexão estabelecida com sucesso:", wsUrl);
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

            if (!rawData || rawData.trim() === "") {
              console.warn("[WS] Mensagem vazia recebida");
              return;
            }
            console.log("[WS] Mensagem recebida:", {
              length: rawData.length,
              preview: rawData.substring(0, 100),
            });

            const parsed = JSON.parse(rawData);

            if (
              typeof parsed === "object" &&
              parsed !== null &&
              "type" in parsed &&
              parsed.type === "UPDATE_LIST"
            ) {
              console.log("[WS] UPDATE_LIST recebido");

              if (!("users" in parsed)) {
                console.warn("[WS] UPDATE_LIST sem campo 'users'");
                return;
              }

              if (!Array.isArray(parsed.users)) {
                console.warn(
                  "[WS] Campo 'users' não é um array:",
                  typeof parsed.users
                );
                return;
              }

              console.log(
                `[WS] Processando ${parsed.users.length} usuário(s) recebido(s)`
              );

              const validUsers: RawOnlineUser[] = parsed.users
                .map((u: unknown, index: number): RawOnlineUser | null => {
                  if (
                    typeof u !== "object" ||
                    u === null ||
                    !("profiles" in u) ||
                    typeof u.profiles !== "object" ||
                    u.profiles === null ||
                    !("username" in u.profiles) ||
                    typeof u.profiles.username !== "string" ||
                    u.profiles.username.trim() === ""
                  ) {
                    console.warn(
                      `[WS] Usuário inválido no índice ${index}:`,
                      u
                    );
                    return null;
                  }

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

              console.log(
                `[WS] ${validUsers.length} usuário(s) válido(s) de ${parsed.users.length} recebido(s)`
              );

              setOnlineUsers(validUsers);
            } else {
              console.log(
                "[WS] Mensagem de tipo diferente:",
                parsed.type || "desconhecido"
              );
            }
          } catch (error) {
            console.error("[WS] Erro ao processar mensagem:", error, {
              data: event.data,
            });
          }
        };

        ws.onerror = (error) => {
          console.error("[WS] Erro na conexão WebSocket:", {
            error,
            url: wsUrl,
            readyState: ws.readyState,
          });
          isConnectingRef.current = false;
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          console.log("[WS] ❌ Conexão fechada:", {
            code: event.code,
            reason: event.reason || "sem motivo",
            wasClean: event.wasClean,
            url: wsUrl,
          });
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
              console.log(
                `[WS] 🔄 Tentando reconectar em ${delay}ms (${reconnectAttempts}/${maxReconnectAttempts})`
              );
              reconnectTimeoutRef.current = setTimeout(() => {
                if (shouldReconnect) {
                  connect();
                }
              }, delay);
            } else {
              console.error(
                "[WS] ❌ Número máximo de tentativas de reconexão atingido"
              );
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
