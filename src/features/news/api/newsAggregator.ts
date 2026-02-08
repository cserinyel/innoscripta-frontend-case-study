import type { NewsArticle } from "@/features/news/types/news";
import type { SourceService } from "./lib/types";
import newsApiService from "./sources/newsapi/service";
import guardianService from "./sources/guardian/service";

export const sourceRegistry: SourceService[] = [newsApiService, guardianService];

export const sortByDateDesc = (a: NewsArticle, b: NewsArticle): number =>
  new Date(b.date).getTime() - new Date(a.date).getTime();
