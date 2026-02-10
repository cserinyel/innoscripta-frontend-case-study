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

export const CATEGORY_NAMES = {
  business: "Business",
  entertainment: "Entertainment",
  general: "General",
  health: "Health",
  science: "Science",
  sports: "Sports",
  technology: "Technology",
} as const;

export const SOURCES = ["guardian", "nyt", "newsapi"] as const;

export const SOURCE_NAMES = {
  guardian: "Guardian",
  nyt: "New York Times",
  newsapi: "NewsAPI",
} as const;