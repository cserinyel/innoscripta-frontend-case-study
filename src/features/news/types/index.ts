import type { CATEGORIES, SOURCES } from "../constants";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  author?: string | null;
  source: string;
  category: string;
  date: string;
}


export type CategoryType = (typeof CATEGORIES)[number];
export type SourceType = (typeof SOURCES)[number];