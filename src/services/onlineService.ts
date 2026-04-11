import { RawOnlineUser } from "@/schema/forum";
import { UserWithProfile } from "@/types/autentication";

type OnlineUsersCallback = (users: RawOnlineUser[]) => void;
type ConnectionCallback = (connected: boolean) => void;

export class OnlineService {
  private socket: WebSocket | null = null;
  private onUsersUpdate: OnlineUsersCallback | null = null;
  private onConnectionChange: ConnectionCallback | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private user: UserWithProfile | null = null;

  constructor(user: UserWithProfile | null) {
    this.user = user;
  }

  public connect(onUsersUpdate: OnlineUsersCallback, onConnectionChange: ConnectionCallback) {
    this.onUsersUpdate = onUsersUpdate;
    this.onConnectionChange = onConnectionChange;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    if (typeof window !== "undefined" && document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.connect(onUsersUpdate, onConnectionChange), { once: true });
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `${protocol}//${window.location.host}/socket/online-users`;

    this.socket = new WebSocket(wsUrl);
    this.socket.onopen = () => {
      this.onConnectionChange?.(true);
      this.sendHandshake();
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "online_users") {
        this.onUsersUpdate?.(message.data);
      }
    };

    this.socket.onclose = () => {
      this.onConnectionChange?.(false);
      this.scheduleReconnect();
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  private sendHandshake() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    if (this.user && this.user.username) {
      const handshake = {
        type: "user",
        username: this.user.username,
        role: this.user.role,
        avatar_url: this.user?.avatar_url,
        online_at: new Date().toISOString(),
      };
      this.socket.send(JSON.stringify(handshake));
    } else {
      this.socket.send(JSON.stringify({ type: "visitor" }));
    }
  }

  public updateUser(user: UserWithProfile | null) {
    this.user = user;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.sendHandshake();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      this.connect(this.onUsersUpdate!, this.onConnectionChange!);
    }, 5000);
  }

  public disconnect() {
    this.user = null;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
  }
}