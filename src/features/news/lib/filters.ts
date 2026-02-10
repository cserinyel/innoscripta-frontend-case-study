import type { NewsArticle } from "@/features/news/types/news";
import type { Category, Source } from "@/features/news/api/lib/types";

interface ArticleFilterParams {
  excludedWriters: string[];
  selectedSources: Source[];
  selectedCategories: Category[];
}

export const filterArticles = (
  articles: NewsArticle[],
  params: ArticleFilterParams,
): NewsArticle[] =>
  articles.filter((a) => {
    if (!params.selectedSources.includes(a.source as never)) return false;
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
