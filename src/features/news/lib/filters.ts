import type { NewsArticle, CategoryType, SourceType } from "@/features/news/types";
import { SOURCE_NAMES } from "@/features/news/constants";

interface ArticleFilterParams {
  excludedWriters: string[];
  selectedSources: SourceType[];
  selectedCategories: CategoryType[];
}

export const filterArticles = (
  articles: NewsArticle[],
  params: ArticleFilterParams,
): NewsArticle[] => {
  const allowedSourceNames: Set<string> = new Set(
    params.selectedSources.map((id) => SOURCE_NAMES[id]),
  );

  return articles.filter((a) => {
    if (!allowedSourceNames.has(a.source)) return false;
    if (a.category && !params.selectedCategories.includes(a.category as never))
      return false;
    if (
      a.author &&
      params.excludedWriters.some((w) =>
        new RegExp(
          `\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        ).test(a.author!),
      )
    )
      return false;
    return true;
  });
};
