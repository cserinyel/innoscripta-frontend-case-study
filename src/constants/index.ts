export const DEFAULT_PAGE_SIZE = 10;

/** Cap pagination to 100x the page size (i.e. 1000 articles) to stay within all API limits. */
export const MAX_PAGINATABLE_ARTICLES = DEFAULT_PAGE_SIZE * 100;
export const CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
] as const;

export const SOURCES = ["Guardian", "New York Times", "NewsAPI"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Source = (typeof SOURCES)[number];
