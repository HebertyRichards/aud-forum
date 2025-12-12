"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/services/auth";

export function UserActivityTracker() {
  const auth = useAuth();
  const user = auth?.user;
  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const wsBaseUrl = apiUrl?.replace(/^http/, "ws");
    const wsUrl = `${wsBaseUrl}/user/ws/ping`;

    const connect = () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("🟢 WS: Conectado");
        intervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send("ping");
        }, 60000);
      };

      ws.onclose = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      ws.onerror = (error) => {
        console.error("⚠️ WS Erro:", error);
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

  return null;
}
