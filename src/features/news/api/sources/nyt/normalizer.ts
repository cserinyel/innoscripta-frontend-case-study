import type { NewsArticle } from "@/features/news/types/news";
import { generateArticleId } from "../../lib/utils";
import type { NytDocDto } from "./types";

const normalizeNytArticle = (
  doc: NytDocDto,
  category: string,
): NewsArticle => ({
  id: generateArticleId(doc.web_url),
  title: doc.headline.main,
  description: doc.abstract || doc.snippet || "",
  url: doc.web_url,
  imageUrl: doc.multimedia?.default?.url || null,
  author: doc.byline?.original ?? null,
  source: "New York Times",
  category,
  date: doc.pub_date,
});

export const normalizeNytResponse = (
  docs: NytDocDto[],
  category: string,
): NewsArticle[] => docs.map((doc) => normalizeNytArticle(doc, category));
