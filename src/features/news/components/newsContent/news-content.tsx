import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/shared/searchInput/search-input";
import FilterBar from "@/components/layout/FilterBar";
import NewsCard from "@/features/news/components/newsCard/news-card";
import LoadingSkeleton from "@/components/shared/loadingSkeleton/loading-skeleton";
import ErrorState from "@/components/shared/errorState/error-state";
import EmptyState from "@/components/shared/emptyState/empty-state";
import ArticlePagination from "@/components/shared/pagination/pagination";
import { useAppSelector } from "@/app/hooks";
import { selectSelectedSources } from "@/features/preferences/store/preferencesSlice";
import { SOURCE_NAMES } from "@/features/news/constants";
import { useNewsSearch } from "@/features/news/api/hooks/useNewsSearch";
import { useFilteredArticles } from "@/features/news/api/hooks/useFilteredArticles";
import type { SearchParams } from "@/features/news/api/lib/types";
import type { CategoryType, SourceType } from "../../types";

const NewsContent = (): React.ReactElement => {
  const [keyword, setKeyword] = useState("");
  const [activeSources, setActiveSources] = useState<SourceType[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);

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

  const preferredSources = useAppSelector(selectSelectedSources);
  const filteredArticles = useFilteredArticles(articles);

  useEffect(() => {
    search({
      keyword: "",
      sources: preferredSources.map((id) => SOURCE_NAMES[id]),
      category: "",
      dateFrom: "",
      dateTo: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = () => {
    const sourcesToQuery =
      activeSources.length > 0
        ? activeSources.filter((id) => preferredSources.includes(id))
        : preferredSources;

    const params: SearchParams = {
      keyword,
      sources: sourcesToQuery.map((id) => SOURCE_NAMES[id]),
      category: activeCategory,
      dateFrom,
      dateTo,
    };

    search(params);
  };

  const handleDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
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
          activeSources={activeSources}
          onSourcesChange={setActiveSources}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateChange={handleDateChange}
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
