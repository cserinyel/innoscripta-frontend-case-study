import type { NewsArticle } from "@/features/news/types/news";
import { generateArticleId } from "../../lib/utils";
import type { NewsApiArticleDto } from "./types";

const normalizeNewsApiArticle = (
  article: NewsApiArticleDto,
  category: string,
): NewsArticle => ({
  id: generateArticleId(article.url || article.title),
  title: article.title,
  description: article.description ?? "",
  url: article.url,
  imageUrl: article.urlToImage,
  author: article.author ?? null,
  source: "NewsAPI",
  category,
  date: article.publishedAt,
});

export const normalizeNewsApiResponse = (
  articles: NewsApiArticleDto[],
  category: string,
): NewsArticle[] =>
  articles
    .map((article) => normalizeNewsApiArticle(article, category));
