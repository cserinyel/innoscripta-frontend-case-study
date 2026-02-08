import { useState, useCallback, useMemo, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import type { NewsArticle } from "@/features/news/types/news";
import type { SearchParams, SearchResult, SearchMeta, ApiError } from "../lib/types";
import { sourceRegistry, sortByDateDesc } from "../newsAggregator";
import { getErrorMessage } from "../lib/utils";

const buildMetaKey = (sourceName: string, params: SearchParams): string =>
  `${sourceName}:${params.keyword}:${params.category}:${params.date}`;

const needsNextPage = (date: string, meta: SearchMeta): boolean => {
  if (!meta.oldestDate) return false;
  const oldestDay = meta.oldestDate.slice(0, 10);
  return date < oldestDay && meta.totalResults > meta.pageSize;
};

export const useNewsSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [metaMap, setMetaMap] = useState<Record<string, SearchMeta>>({});

  const activeSources = useMemo(() => {
    if (!searchParams) return [];
    return searchParams.source
      ? sourceRegistry.filter((s) => s.name === searchParams.source)
      : sourceRegistry;
  }, [searchParams]);

  const effectiveParamsPerSource = useMemo(() => {
    if (!searchParams) return [];
    return activeSources.map((source) => {
      const meta = metaMap[buildMetaKey(source.name, searchParams)];
      const page =
        meta && searchParams.date && needsNextPage(searchParams.date, meta)
          ? 1
          : 0;
      return { ...searchParams, page };
    });
  }, [searchParams, activeSources, metaMap]);

  const results = useQueries({
    queries: searchParams
      ? activeSources.map((source, i) => {
          const params = effectiveParamsPerSource[i];
          return {
            queryKey: [source.name, ...source.getFetchKey(params)],
            queryFn: (): Promise<SearchResult> => source.search(params),
          };
        })
      : [],
  });

  // Store meta only from initial (page 0) fetches to avoid oscillation
  useEffect(() => {
    if (!searchParams) return;
    results.forEach((result, index) => {
      if (result.data?.meta) {
        const source = activeSources[index];
        if (source) {
          const key = buildMetaKey(source.name, searchParams);
          setMetaMap((prev) => (key in prev ? prev : { ...prev, [key]: result.data!.meta! }));
        }
      }
    });
  }, [results, activeSources, searchParams]);

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

    const filtered = searchParams?.date
      ? allArticles.filter((a) => a.date.startsWith(searchParams.date))
      : allArticles;

    filtered.sort(sortByDateDesc);

    return { articles: filtered, errors: allErrors };
  }, [results, activeSources, searchParams]);

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
