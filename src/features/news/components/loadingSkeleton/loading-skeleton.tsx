import { Card } from "@/components/ui/card";

const ARTICLE_GRID = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

const SkeletonCard = (): React.ReactElement => (
  <Card size="sm" className="flex animate-pulse flex-col">
    <div className="bg-muted h-40 rounded-t-lg" />
    <div className="space-y-2 p-4">
      <div className="bg-muted h-4 w-3/4 rounded" />
      <div className="bg-muted h-3 w-1/3 rounded" />
    </div>
    <div className="flex-1 space-y-2 px-4">
      <div className="bg-muted h-3 rounded" />
      <div className="bg-muted h-3 w-5/6 rounded" />
    </div>
    <div className="flex gap-2 p-4">
      <div className="bg-muted h-5 w-16 rounded-full" />
      <div className="bg-muted h-5 w-20 rounded-full" />
    </div>
  </Card>
);

const LoadingSkeleton = (): React.ReactElement => (
  <div className={ARTICLE_GRID}>
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;
