export const CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
] as const;

export const SOURCES = ["Guardian", "New York Times"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Source = (typeof SOURCES)[number];
