import type { NewsArticle } from "@/features/news/types/news";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NewsCard = ({
  title,
  description,
  source,
  category,
  date,
}: NewsArticle): React.ReactElement => {
  return (
    <Card size="sm" className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <span className="text-muted-foreground text-xs">{date}</span>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Badge variant="outline">{source}</Badge>
        <Badge variant="secondary">{category}</Badge>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
