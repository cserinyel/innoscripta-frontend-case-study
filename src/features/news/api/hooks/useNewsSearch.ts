import { useState, useCallback, useMemo } from "react";
import { useQueries, keepPreviousData } from "@tanstack/react-query";
import type { NewsArticle } from "@/features/news/types/news";
import type { SearchParams, SearchResult, ApiError } from "../lib/types";
import { sourceRegistry } from "../newsAggregator";
import { getErrorMessage } from "../lib/utils";

export const useNewsSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [page, setPage] = useState(0);

  const activeSources = useMemo(() => {
    if (!searchParams) return [];
    return searchParams.source
      ? sourceRegistry.filter((s) => s.name === searchParams.source)
      : sourceRegistry;
  }, [searchParams]);

  const paginatedParams = useMemo<SearchParams | null>(
    () => (searchParams ? { ...searchParams, page } : null),
    [searchParams, page],
  );

  const results = useQueries({
    queries: paginatedParams
      ? activeSources.map((source) => ({
          queryKey: [source.name, ...source.getFetchKey(paginatedParams)],
          queryFn: (): Promise<SearchResult> => source.search(paginatedParams),
          placeholderData: keepPreviousData,
        }))
      : [],
  });

  const isLoading = results.some((r) => r.isLoading && r.isFetching);
  const isError = results.some((r) => r.isError);
  const firstError = results.find((r) => r.error)?.error ?? null;

  const { articles, errors, totalPages } = useMemo(() => {
    const allArticles: NewsArticle[] = [];
    const allErrors: ApiError[] = [];
    let maxPages = 0;

    results.forEach((result, index) => {
      if (result.data) {
        allArticles.push(...result.data.articles);

        if (result.data.meta) {
          const { totalResults, pageSize } = result.data.meta;
          const sourcePages = Math.ceil(totalResults / pageSize);
          maxPages = Math.max(maxPages, sourcePages);
        }
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

    return { articles: allArticles, errors: allErrors, totalPages: maxPages };
  }, [results, activeSources]);

  const search = useCallback((params: SearchParams) => {
    setPage(0);
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
    page,
    totalPages,
    setPage,
  };
};
