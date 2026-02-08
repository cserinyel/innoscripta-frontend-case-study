import type { NewsArticle } from "@/features/news/types/news";
import { generateArticleId } from "../../lib/utils";
import type { GuardianResultDto } from "./types";

const normalizeGuardianArticle = (
  article: GuardianResultDto,
  category: string,
): NewsArticle => ({
  id: generateArticleId(article.webUrl),
  title: article.fields?.headline ?? article.webTitle,
  description: article.fields?.trailText ?? "",
  url: article.webUrl,
  imageUrl: article.fields?.thumbnail ?? null,
  author: article.fields?.byline ?? null,
  source: "Guardian",
  category,
  date: article.webPublicationDate,
});

export const normalizeGuardianResponse = (
  results: GuardianResultDto[],
  category: string,
): NewsArticle[] =>
  results.map((article) => normalizeGuardianArticle(article, category));
