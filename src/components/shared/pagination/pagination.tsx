import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const current = currentPage + 1; // convert to 1-indexed
  const pages: (number | "ellipsis")[] = [];

  // Always include first page
  pages.push(1);

  // Left ellipsis or page 2
  if (current > 3) {
    pages.push("ellipsis");
  } else if (totalPages > 1) {
    pages.push(2);
  }

  // Pages around current
  const start = Math.max(3, current - 1);
  const end = Math.min(totalPages - 2, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Right ellipsis or second-to-last
  if (current < totalPages - 2) {
    pages.push("ellipsis");
  } else if (totalPages > 1) {
    pages.push(totalPages - 1);
  }

  // Always include last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

const ArticlePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): React.ReactElement | null => {
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handleClick =
    (page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onPageChange(page);
    };

  return (
    <PaginationRoot className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handleClick(currentPage - 1)}
            aria-disabled={isFirstPage}
            className={
              isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>

        {pageNumbers.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item - 1 === currentPage}
                onClick={handleClick(item - 1)}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleClick(currentPage + 1)}
            aria-disabled={isLastPage}
            className={
              isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};

export default ArticlePagination;
