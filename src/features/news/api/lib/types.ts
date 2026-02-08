import type { NewsArticle } from "@/features/news/types/news";

export interface SearchParams {
  keyword: string;
  category: string;
  source: string;
  date: string;
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  source?: string;
}

export interface SearchMeta {
  totalResults: number;
  pageSize: number;
}

export interface SearchResult {
  articles: NewsArticle[];
  meta?: SearchMeta;
}

export interface SourceService {
  name: string;
  search: (params: SearchParams) => Promise<SearchResult>;
  getFetchKey: (params: SearchParams) => unknown[];
}
