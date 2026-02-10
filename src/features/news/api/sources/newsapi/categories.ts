import { getSourceToCategoryMap } from "../../lib/utils";

const NEWSAPI_CATEGORY_BY_SOURCE_MAP: Record<string, string[]> = {
  general: [ "abc-news", "abc-news-au", "aftenposten", "al-jazeera-english", "ansa", "ary-news", "associated-press", "axios", "bbc-news", "bild", "blasting-news-br", "breitbart-news", "cbc-news", "cbs-news", "cnn", "cnn-es", "der-tagesspiegel", "el-mundo", "focus", "fox-news", "globo", "google-news", "google-news-ar", "google-news-au", "google-news-br", "google-news-ca", "google-news-fr", "google-news-in", "google-news-is", "google-news-it", "google-news-ru", "google-news-sa", "google-news-uk", "goteborgs-posten", "independent", "infobae", "la-gaceta", "la-nacion", "la-repubblica", "le-monde", "lenta", "liberation", "msnbc", "national-review", "nbc-news", "news24", "news-com-au", "newsweek", "new-york-magazine", "nrk", "politico", "rbc", "reddit-r-all", "reuters", "rt", "rte", "rtl-nieuws", "sabq", "spiegel-online", "svenska-dagbladet", "the-american-conservative", "the-globe-and-mail", "the-hill", "the-hindu", "the-huffington-post", "the-irish-times", "the-jerusalem-post", "the-times-of-india", "the-washington-post", "the-washington-times", "time", "usa-today", "vice-news", "xinhua-net", "ynet"],
  business: [ "argaam", "australian-financial-review", "bloomberg", "business-insider", "die-zeit", "financial-post", "fortune", "handelsblatt", "il-sole-24-ore", "info-money", "les-echos", "the-wall-street-journal", "wirtschafts-woche"],
  technology: [ "ars-technica", "crypto-coins-news", "engadget", "gruenderszene", "hacker-news", "recode", "t3n", "techcrunch", "techcrunch-cn", "techradar", "the-next-web", "the-verge", "wired", "wired-de"],
  sports: [ "bbc-sport", "bleacher-report", "espn", "espn-cric-info", "football-italia", "four-four-two", "fox-sports", "lequipe", "marca", "nfl-news", "nhl-news", "talksport", "the-sport-bible"],
  entertainment: [ "buzzfeed", "entertainment-weekly", "ign", "mashable", "mtv-news", "mtv-news-uk", "polygon", "the-lad-bible"],
  health: ["medical-news-today"],
  science: ["national-geographic", "new-scientist", "next-big-future"],
};

/**
 * Reverse lookup: source ID -> category.
 * Built once from NEWSAPI_CATEGORY_BY_SOURCE_MAP.
 */
export const NEWSAPI_SOURCE_TO_CATEGORY_MAP = getSourceToCategoryMap(NEWSAPI_CATEGORY_BY_SOURCE_MAP);

/**
 * All known source IDs flattened into a single comma-separated string.
 * Used as a fallback when no category or keyword is provided,
 * because the /everything endpoint requires at least one of q, sources, or domains.
 */
const ALL_SOURCES = Object.values(NEWSAPI_CATEGORY_BY_SOURCE_MAP)
  .flat()
  .join(",");

/**
 * Maps a generic app category to a comma-separated NewsAPI sources string.
 * Returns undefined when no category is provided or no mapping exists.
 */
export const mapCategoryToNewsApiSources = (
  category: string,
): string | undefined => {
  if (!category) return undefined;

  const sources = NEWSAPI_CATEGORY_BY_SOURCE_MAP[category];
  return sources ? sources.join(",") : undefined;
};

/**
 * Returns all known source IDs as a comma-separated string.
 * Serves as a fallback for the /everything endpoint when neither
 * keyword nor category is provided.
 */
export const getAllNewsApiSources = (): string => ALL_SOURCES;
