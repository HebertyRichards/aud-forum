"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/services/auth";

export function UserActivityTracker() {
  const auth = useAuth();
  const user = auth?.user;
  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.close(1000, "User logged out");
        socketRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const wsBaseUrl = apiUrl.replace(/^https?/, (match) =>
      match === "https" ? "wss" : "ws"
    );
    const wsUrl = `${wsBaseUrl}/user/ws/ping`;

    let shouldReconnect = true;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let isConnecting = false;

    const connect = () => {
      if (!user) {
        return;
      }

      if (isConnecting || socketRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      isConnecting = true;

      try {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          isConnecting = false;
          reconnectAttempts = 0;
          intervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN && user) {
              ws.send("ping");
            }
          }, 60000);
        };

        ws.onclose = (event) => {
          isConnecting = false;

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          if (shouldReconnect && user && event.code !== 1000) {
            reconnectAttempts++;
            if (reconnectAttempts <= maxReconnectAttempts) {
              const delay = Math.min(3000 * reconnectAttempts, 30000);
              reconnectTimeoutRef.current = setTimeout(() => {
                if (shouldReconnect && user) {
                  connect();
                }
              }, delay);
            }
          }
        };
        ws.onerror = () => {};

        socketRef.current = ws;
      } catch (error) {
        console.error("Erro ao conectar", error);
        isConnecting = false;
        if (
          shouldReconnect &&
          user &&
          reconnectAttempts < maxReconnectAttempts
        ) {
          reconnectAttempts++;
          reconnectTimeoutRef.current = setTimeout(() => {
            if (shouldReconnect && user) {
              connect();
            }
          }, 1500);
        }
      }
    };

    connect();

    return () => {
      shouldReconnect = false;
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
  }, [user]);

  return null;
}
