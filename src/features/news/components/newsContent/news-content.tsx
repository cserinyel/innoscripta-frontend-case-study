import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
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

  useEffect(() => {
    sourceErrors.forEach((err) => {
      toast.error(`${err.source ?? "Source"}: ${err.message}`, {
        id: err.source,
      });
    });
  }, [sourceErrors]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (articles.length === 0 && sourceErrors.length > 0) {
      return <ErrorState message={sourceErrors[0].message} onRetry={handleSearch} />;
    }

    if (articles.length === 0) {
      return <EmptyState hasSearched={hasSearched} />;
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
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
    <div ref={contentRef}>
      <SearchInput
        value={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <FilterBar
        activeSource={activeSource}
        onSourceChange={setActiveSource}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        date={date}
        onDateChange={setDate}
      />
      {renderContent()}
    </div>
  );
};

export default NewsContent;
