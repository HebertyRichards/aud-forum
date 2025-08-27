import { type LucideIcon } from "lucide-react";

export type SubItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type ForumCategory = {
  id: string;
  title: string;
  subItems: SubItem[];
};