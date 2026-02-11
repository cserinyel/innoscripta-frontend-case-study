import { getSourceToCategoryMap } from "../../lib/utils";

export const NYT_CATEGORY_MAP: Record<string, string[]> = {
  business: ["business", "your-money", "jobs", "markets-overview", "realestate"],
  entertainment: ["arts", "books", "movies", "theater", "style", "t-magazine", "fashion", "magazine", "travel", "podcasts"],
  general: ["us", "world", "nyregion", "opinion", "politics", "corrections", "education", "headway", "learning", "obituaries", "reader-center", "weather", "the-learning-network", "briefing"],
  health: ["health", "well", "food"],
  science: ["science", "climate"],
  sports: ["sports"],
  technology: ["technology"],
};

/**
 * Reverse lookup: source ID -> category.
 * Built once from NYT_CATEGORY_MAP.
 */
export const NYT_SOURCE_TO_CATEGORY_MAP = getSourceToCategoryMap(NYT_CATEGORY_MAP);

/**
 * Maps a generic app category to an NYT fq filter string for section.name.
 * Returns undefined when no category is provided or no mapping exists.
 */
export const mapCategoryToNytFilter = (
  category: string,
): string | undefined => {
  if (!category) return undefined;

  const sections = NYT_CATEGORY_MAP[category];
  if (!sections) return undefined;

  const quoted = sections.map((s) => `"${s}"`).join(", ");
  return `section.name:(${quoted})`;
};
