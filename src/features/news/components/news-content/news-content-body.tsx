import NewsCard from "@/features/news/components/news-card/news-card";
import LoadingSkeleton from "@/components/shared/loading-skeleton/loading-skeleton";
import ErrorState from "@/components/shared/error-state/error-state";
import EmptyState from "@/components/shared/empty-state/empty-state";
import ArticlePagination from "@/components/shared/pagination/pagination";
import type { NewsArticle } from "@/features/news/types";
import type { ApiError } from "@/features/news/api/lib/types";

interface NewsContentBodyProps {
  isLoading: boolean;
  filteredArticles: NewsArticle[];
  sourceErrors: ApiError[];
  hasSearched: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

const NewsContentBody = ({
  isLoading,
  filteredArticles,
  sourceErrors,
  hasSearched,
  page,
  totalPages,
  onPageChange,
  onRetry,
}: NewsContentBodyProps): React.ReactElement => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (filteredArticles.length === 0) {
    if (sourceErrors.length > 0) {
      return (
        <ErrorState
          message={sourceErrors[0].message}
          onRetry={onRetry}
        />
      );
    }
    return <EmptyState hasSearched={hasSearched} />;
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
        onPageChange={onPageChange}
      />
    </>
  );
};

export default NewsContentBody;
