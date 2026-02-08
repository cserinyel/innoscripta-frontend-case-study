import type { NewsArticle } from "@/features/news/types/news";
import type { SourceService } from "./lib/types";
import newsApiService from "./sources/newsapi/service";

export const sourceRegistry: SourceService[] = [newsApiService];

export const sortByDateDesc = (a: NewsArticle, b: NewsArticle): number =>
  new Date(b.date).getTime() - new Date(a.date).getTime();
