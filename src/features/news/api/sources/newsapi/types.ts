export interface NewsApiSourceDto {
  id: string | null;
  name: string;
}

export interface NewsApiArticleDto {
  source: NewsApiSourceDto;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponseDto {
  status: string;
  totalResults: number;
  articles: NewsApiArticleDto[] | null;
  code?: string;
  message?: string;
}
