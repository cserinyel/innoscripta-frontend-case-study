export interface GnewsSourceDto {
  id: string;
  name: string;
  url: string;
  country?: string;
}

export interface GnewsArticleDto {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  image: string | null;
  publishedAt: string;
  lang: string;
  source: GnewsSourceDto;
}

export interface GnewsResponseDto {
  totalArticles: number;
  articles: GnewsArticleDto[];
}
