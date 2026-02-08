import { Search } from "lucide-react";

const EmptyState = ({
  hasSearched,
}: {
  hasSearched: boolean;
}): React.ReactElement => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <Search className="text-muted-foreground size-12" />
    <div className="text-center">
      <p className="text-lg font-medium">
        {hasSearched ? "No articles found" : "Search for news"}
      </p>
      <p className="text-muted-foreground text-sm">
        {hasSearched
          ? "Try adjusting your search keyword or filters."
          : "Type a keyword and click Search to find articles."}
      </p>
    </div>
  </div>
);

export default EmptyState;
