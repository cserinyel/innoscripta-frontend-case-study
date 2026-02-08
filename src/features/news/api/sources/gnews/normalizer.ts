import type { NewsArticle } from "@/features/news/types/news";
import { generateArticleId } from "../../lib/utils";
import type { GnewsArticleDto } from "./types";

const normalizeGnewsArticle = (
  article: GnewsArticleDto,
  category: string,
): NewsArticle => ({
  id: generateArticleId(article.url),
  title: article.title,
  description: article.description ?? "",
  url: article.url,
  imageUrl: article.image ?? null,
  author: article.source.name ?? null,
  source: "GNews",
  category,
  date: article.publishedAt,
});

export const normalizeGnewsResponse = (
  articles: GnewsArticleDto[],
  category: string,
): NewsArticle[] =>
  articles.map((article) => normalizeGnewsArticle(article, category));
