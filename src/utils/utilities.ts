import React, { ReactElement } from "react";
import {
  Book,
  Download,
  Megaphone,
  MessagesSquare,
  PenSquare,
  Users,
} from "lucide-react";

export const ALLOWED_ROLES = [
  "Auditore",
  "Leader",
  "Fundador",
  "Desenvolvedor",
];

export const AUTHOR = ["HebertyRichards"];

export const categoryDetailsMap: Record<string, { icon: ReactElement }> = {
  downloads: {
    icon: React.createElement(Download, { className: "h-8 w-8 text-blue-500" }),
  },
  manuals: {
    icon: React.createElement(Book, { className: "h-8 w-8 text-yellow-500" }),
  },
  "general-discussions": {
    icon: React.createElement(MessagesSquare, {
      className: "h-8 w-8 text-purple-500",
    }),
  },
  members: {
    icon: React.createElement(Users, { className: "h-8 w-8 text-teal-500" }),
  },
  subscribes: {
    icon: React.createElement(PenSquare, {
      className: "h-8 w-8 text-orange-500",
    }),
  },
  updates: {
    icon: React.createElement(Megaphone, {
      className: "h-8 w-8 text-green-500",
    }),
  },
};
