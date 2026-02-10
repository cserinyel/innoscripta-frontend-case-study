import { useMemo } from "react";
import { useAppSelector } from "@/app/hooks";
import {
  selectExcludedWriters,
  selectSelectedCategories,
  selectSelectedSources,
} from "@/features/preferences/store/preferencesSlice";
import type { NewsArticle } from "@/features/news/types/news";
import { filterArticles } from "@/features/news/lib/filters";

export const useFilteredArticles = (
  articles: NewsArticle[],
): NewsArticle[] => {
  const excludedWriters = useAppSelector(selectExcludedWriters);
  const selectedSources = useAppSelector(selectSelectedSources);
  const selectedCategories = useAppSelector(selectSelectedCategories);

  return useMemo(
    () =>
      filterArticles(articles, {
        excludedWriters,
        selectedSources,
        selectedCategories,
      }),
    [articles, excludedWriters, selectedSources, selectedCategories],
  );
};
