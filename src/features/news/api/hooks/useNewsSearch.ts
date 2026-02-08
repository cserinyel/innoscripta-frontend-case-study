import { useState, useCallback, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { NewsArticle } from "@/features/news/types/news";
import type { SearchParams, SearchResult, ApiError } from "../lib/types";
import { sourceRegistry } from "../newsAggregator";
import { getErrorMessage } from "../lib/utils";

export const useNewsSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const activeSources = useMemo(() => {
    if (!searchParams) return [];
    return searchParams.source
      ? sourceRegistry.filter((s) => s.name === searchParams.source)
      : sourceRegistry;
  }, [searchParams]);

  const results = useQueries({
    queries: searchParams
      ? activeSources.map((source) => ({
          queryKey: [source.name, ...source.getFetchKey(searchParams)],
          queryFn: (): Promise<SearchResult> => source.search(searchParams),
        }))
      : [],
  });

  const isLoading = results.some((r) => r.isLoading && r.isFetching);
  const isError = results.some((r) => r.isError);
  const firstError = results.find((r) => r.error)?.error ?? null;

  const { articles, errors } = useMemo(() => {
    const allArticles: NewsArticle[] = [];
    const allErrors: ApiError[] = [];

    results.forEach((result, index) => {
      if (result.data) {
        allArticles.push(...result.data.articles);
      }
      if (result.isError && result.error) {
        allErrors.push({
          message:
            result.error instanceof Error
              ? result.error.message
              : "Unknown error",
          source: activeSources[index]?.name,
        });
      }
    });

    allArticles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return { articles: allArticles, errors: allErrors };
  }, [results, activeSources]);

  const search = useCallback((params: SearchParams) => {
    setSearchParams({ ...params });
  }, []);

  return {
    articles,
    sourceErrors: errors,
    isLoading,
    isError,
    errorMessage: firstError ? getErrorMessage(firstError) : null,
    search,
    hasSearched: searchParams !== null,
  };
};
