export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  author?: string | null;
  source: string;
  category: string;
  date: string;
}
