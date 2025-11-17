import type { Product } from "@/lib/recommend";

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  role: "user" | "bot";
  timestamp: Date;

  content?: string;
  isLoading?: boolean;

  type?: "text" | "products";
  products?: Product[];
  summary?: string;
}
