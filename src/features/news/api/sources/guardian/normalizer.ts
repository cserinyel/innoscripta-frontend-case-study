import type { NewsArticle } from "@/features/news/types";
import { generateArticleId } from "../../lib/utils";
import type { GuardianResultDto } from "./types";
import { getCategoryBySourceId } from "../../lib/utils";
import { GUARDIAN_SOURCE_TO_CATEGORY_MAP } from "./categories";

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
  category: category || getCategoryBySourceId(GUARDIAN_SOURCE_TO_CATEGORY_MAP, article.sectionId),
  date: article.webPublicationDate,
});

export const normalizeGuardianResponse = (
  results: GuardianResultDto[],
  category: string,
): NewsArticle[] =>
  results.map((article) => normalizeGuardianArticle(article, category));
