import type { NewsArticle } from "@/features/news/types/news";
import { generateArticleId } from "../../lib/utils";
import type { NewsApiArticleDto } from "./types";
import { getCategoryBySourceId } from "./categories";

const normalizeNewsApiArticle = (
  article: NewsApiArticleDto,
  category: string,
): NewsArticle => ({
  id: generateArticleId(article.url),
  title: article.title,
  description: article.description ?? "",
  url: article.url,
  imageUrl: article.urlToImage ?? null,
  author: article.author ?? null,
  source: "NewsAPI",
  category: category || getCategoryBySourceId(article.source.id),
  date: article.publishedAt,
});

export const normalizeNewsApiResponse = (
  articles: NewsApiArticleDto[],
  category: string,
): NewsArticle[] =>
  articles.map((article) => normalizeNewsApiArticle(article, category));
