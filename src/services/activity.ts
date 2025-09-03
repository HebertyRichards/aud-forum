"use client";

import { useEffect } from "react";
import { useAuth } from "@/services/auth";
import axios from "axios";

export function UserActivityTracker() {
  const auth = useAuth();
  const user = auth?.user;

  useEffect(() => {
    if (!user) {
      return;
    }

    const ping = async () => {
      try {
        await axios.post(`/api/user/ping`, {}, {
          withCredentials: true,
        });
      } catch {
      }
    };
    ping();
    const interval = setInterval(ping, 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  return null;
}
