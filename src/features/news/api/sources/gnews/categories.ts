const GNEWS_CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
] as const;

type GnewsCategory = (typeof GNEWS_CATEGORIES)[number];

/**
 * Maps a generic app category to a GNews category string.
 * Returns undefined when no category is provided or no mapping exists.
 * GNews supports the same categories as the app, so the mapping is 1:1.
 */
export const mapCategoryToGnews = (
  category: string,
): GnewsCategory | undefined => {
  if (!category) return undefined;

  return GNEWS_CATEGORIES.includes(category as GnewsCategory)
    ? (category as GnewsCategory)
    : undefined;
};
