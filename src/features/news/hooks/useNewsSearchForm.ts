import { useState, useCallback } from "react";
import type { SearchParams } from "@/features/news/api/lib/types";
import { SOURCE_NAMES } from "@/features/news/constants";
import type { CategoryType, SourceType } from "@/features/news/types";

export const useNewsSearchForm = () => {
  const [keyword, setKeyword] = useState("");
  const [activeSources, setActiveSources] = useState<SourceType[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const buildSearchParams = useCallback(
    (preferredSources: SourceType[]): SearchParams => {
      const sourcesToQuery =
        activeSources.length > 0
          ? activeSources.filter((id) => preferredSources.includes(id))
          : preferredSources;

      return {
        keyword,
        sources: sourcesToQuery.map((id) => SOURCE_NAMES[id]),
        category: activeCategory,
        dateFrom,
        dateTo,
      };
    },
    [keyword, activeSources, activeCategory, dateFrom, dateTo],
  );

  const onDateChange = useCallback((from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  }, []);

  return {
    keyword,
    setKeyword,
    activeSources,
    onSourcesChange: setActiveSources,
    activeCategory,
    onCategoryChange: setActiveCategory,
    dateFrom,
    dateTo,
    onDateChange,
    buildSearchParams,
  };
};
