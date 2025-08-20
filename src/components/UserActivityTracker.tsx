"use client";

import { useEffect } from "react";
import { useAuth } from "@/services/auth";

export function UserActivityTracker() {
  const auth = useAuth();
  const user = auth?.user;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user) {
      return;
    }

    const ping = async () => {
      try {
        await fetch(`${API_URL}/user/ping`, {
          method: "POST",
          credentials: "include",
        });
      } catch {}
    };
    ping();
    const interval = setInterval(ping, 60 * 1000);

    return () => clearInterval(interval);
  }, [user, API_URL]);

  return null;
}
