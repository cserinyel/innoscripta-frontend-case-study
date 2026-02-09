import type { NewsArticle } from "@/features/news/types/news";
import { formatDate } from "@/features/news/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import fallbackImage from "@/assets/no-image.jpg";

const NewsCard = ({
  title,
  description,
  url,
  imageUrl,
  source,
  category,
  date,
  author,
}: NewsArticle): React.ReactElement => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <Card
        size="sm"
        className="flex h-full flex-col transition-shadow group-hover:shadow-md pt-0!"
      >
        <div className="overflow-hidden rounded-t-lg">
          <img
            src={imageUrl ?? fallbackImage}
            alt={title}
            className="h-40 w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <span className="text-muted-foreground text-xs">
            {formatDate(date)}
          </span>
          <span className="text-muted-foreground text-xs">{author}</span>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {description}
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Badge variant="outline">{source}</Badge>
          {category && <Badge variant="secondary">{category}</Badge>}
        </CardFooter>
      </Card>
    </a>
  );
};

export default NewsCard;
