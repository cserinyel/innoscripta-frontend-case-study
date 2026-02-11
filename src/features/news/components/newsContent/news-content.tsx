import { useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/shared/searchInput/search-input";
import NewsFilterBar from "@/features/news/components/newsFilterBar/news-filter-bar";
import NewsContentBody from "@/features/news/components/newsContent/news-content-body";
import { useAppSelector } from "@/app/hooks";
import { selectSelectedSources } from "@/features/preferences/store/preferencesSlice";
import { SOURCE_NAMES } from "@/features/news/constants";
import { useNewsSearch } from "@/features/news/api/hooks/useNewsSearch";
import { useFilteredArticles } from "@/features/news/api/hooks/useFilteredArticles";
import { useNewsSearchForm } from "@/features/news/hooks/useNewsSearchForm";
import { useSourceErrorToasts } from "@/features/news/hooks/useSourceErrorToasts";

const NewsContent = (): React.ReactElement => {
  const contentRef = useRef<HTMLDivElement>(null);
  const preferredSources = useAppSelector(selectSelectedSources);

  const {
    keyword,
    setKeyword,
    activeSources,
    onSourcesChange,
    activeCategory,
    onCategoryChange,
    dateFrom,
    dateTo,
    onDateChange,
    buildSearchParams,
  } = useNewsSearchForm();

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

  useSourceErrorToasts(sourceErrors);

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

  const handleSearch = useCallback(() => {
    search(buildSearchParams(preferredSources));
  }, [search, buildSearchParams, preferredSources]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [setPage],
  );

  return (
    <div ref={contentRef} className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
        />
        <NewsFilterBar
          activeSources={activeSources}
          onSourcesChange={onSourcesChange}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateChange={onDateChange}
        />
        <Button
          className="w-full md:w-auto"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      <NewsContentBody
        isLoading={isLoading}
        filteredArticles={filteredArticles}
        sourceErrors={sourceErrors}
        hasSearched={hasSearched}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onRetry={handleSearch}
      />
    </div>
  );
};

export default NewsContent;
