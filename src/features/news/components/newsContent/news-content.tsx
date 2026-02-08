import { useState } from "react";
import SearchInput from "@/components/shared/searchInput/search-input";
import FilterBar from "@/components/layout/FilterBar";
import NewsCard from "@/features/news/components/newsCard/news-card";
import LoadingSkeleton from "@/components/shared/loadingSkeleton/loading-skeleton";
import ErrorState from "@/components/shared/errorState/error-state";
import EmptyState from "@/components/shared/emptyState/empty-state";
import { useNewsSearch } from "@/features/news/api/hooks/useNewsSearch";
import type { SearchParams } from "@/features/news/api/lib/types";

const ARTICLE_GRID = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

const NewsContent = (): React.ReactElement => {
  const [keyword, setKeyword] = useState("");
  const [activeSource, setActiveSource] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [date, setDate] = useState("");

  const { articles, isLoading, isError, errorMessage, search, hasSearched } =
    useNewsSearch();

  const handleSearch = () => {
    const params: SearchParams = {
      keyword,
      source: activeSource,
      category: activeCategory,
      date,
    };

    search(params);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (isError && errorMessage) {
      return <ErrorState message={errorMessage} onRetry={handleSearch} />;
    }

    if (articles.length === 0) {
      return <EmptyState hasSearched={hasSearched} />;
    }

    return (
      <div className={ARTICLE_GRID}>
        {articles.map((article) => (
          <NewsCard key={article.id} {...article} />
        ))}
      </div>
    );
  };

  return (
    <>
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
    </>
  );
};

export default NewsContent;
