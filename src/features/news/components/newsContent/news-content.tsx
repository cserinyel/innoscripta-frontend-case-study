import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/app/hooks";
import {
  selectExcludedWriters,
  selectSelectedCategories,
  selectSelectedSources,
} from "@/features/preferences/store/preferencesSlice";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/shared/searchInput/search-input";
import FilterBar from "@/components/layout/FilterBar";
import NewsCard from "@/features/news/components/newsCard/news-card";
import LoadingSkeleton from "@/components/shared/loadingSkeleton/loading-skeleton";
import ErrorState from "@/components/shared/errorState/error-state";
import EmptyState from "@/components/shared/emptyState/empty-state";
import ArticlePagination from "@/components/shared/pagination/pagination";
import { useNewsSearch } from "@/features/news/api/hooks/useNewsSearch";
import type { SearchParams } from "@/features/news/api/lib/types";

const NewsContent = (): React.ReactElement => {
  const [keyword, setKeyword] = useState("");
  const [activeSource, setActiveSource] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [date, setDate] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const excludedWriters = useAppSelector(selectExcludedWriters);
  const selectedCategories = useAppSelector(selectSelectedCategories);
  const selectedSources = useAppSelector(selectSelectedSources);

  const {
    articles,
    sourceErrors,
    isLoading,
    search,
    hasSearched,
    page,
    totalPages,
    setPage,
  } = useNewsSearch();

  const filteredArticles = useMemo(
    () =>
      articles.filter((a) => {
        if (
          a.author &&
          excludedWriters.some((w) =>
            new RegExp(
              `\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
            ).test(a.author!),
          )
        )
          return false;
        if (!selectedSources.includes(a.source as never)) return false;
        if (a.category && !selectedCategories.includes(a.category as never))
          return false;
        return true;
      }),
    [articles, excludedWriters, selectedSources, selectedCategories],
  );

  const handleSearch = () => {
    const params: SearchParams = {
      keyword,
      source: activeSource,
      category: activeCategory,
      date,
    };

    search(params);
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [setPage],
  );

  const shownErrorsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentKeys = new Set<string>();

    sourceErrors.forEach((err) => {
      const key = `${err.source ?? "Source"}:${err.message}`;
      currentKeys.add(key);

      if (!shownErrorsRef.current.has(key)) {
        toast.error(`${err.source ?? "Source"}: ${err.message}`, {
          id: err.source,
        });
      }
    });

    shownErrorsRef.current = currentKeys;
  }, [sourceErrors]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (filteredArticles.length === 0) {
      if (sourceErrors.length > 0) {
        return (
          <ErrorState
            message={sourceErrors[0].message}
            onRetry={handleSearch}
          />
        );
      } else {
        return <EmptyState hasSearched={hasSearched} />;
      }
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} {...article} />
          ))}
        </div>
        <ArticlePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div ref={contentRef} className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
        />
        <FilterBar
          activeSource={activeSource}
          onSourceChange={setActiveSource}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          date={date}
          onDateChange={setDate}
        />
        <Button
          className="w-full md:w-auto"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default NewsContent;
