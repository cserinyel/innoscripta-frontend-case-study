const GUARDIAN_CATEGORY_MAP: Record<string, string[]> = {
  business: ["business", "business-to-business", "money", "small-business-network"],
  entertainment: ["culture", "film", "music", "stage", "tv-and-radio", "games", "artanddesign", "fashion"],
  general: ["news", "uk-news", "us-news", "australia-news", "world", "politics", "commentisfree"],
  health: ["healthcare-network", "wellness", "us-wellness", "lifeandstyle"],
  science: ["science", "environment"],
  sports: ["sport", "football"],
  technology: ["technology"],
};

/**
 * Maps a generic app category to a pipe-delimited Guardian sections string.
 * Returns undefined when no category is provided or no mapping exists.
 */
export const mapCategoryToGuardianSections = (
  category: string,
): string | undefined => {
  if (!category) return undefined;

  const sections = GUARDIAN_CATEGORY_MAP[category];
  return sections ? sections.join("|") : undefined;
};
