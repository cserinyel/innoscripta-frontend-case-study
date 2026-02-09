const NYT_CATEGORY_MAP: Record<string, string[]> = {
  business: ["business", "your-money", "jobs", "markets-overview"],
  entertainment: ["arts", "movies", "theater", "style", "t-magazine", "fashion"],
  general: ["us", "world", "nyregion", "opinion", "politics"],
  health: ["health", "well"],
  science: ["science", "climate"],
  sports: ["sports"],
  technology: ["technology"],
};

/**
 * Maps a generic app category to an NYT fq filter string for section.name.
 * Returns undefined when no category is provided or no mapping exists.
 *
 * @example mapCategoryToNytFilter("business") → 'section.name:("Business", "Your Money", "Job Market")'
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
