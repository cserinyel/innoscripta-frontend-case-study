import { describe, it, expect } from "vitest";
import { filterArticles } from "./filters";
import type { NewsArticle } from "@/features/news/types";
import { SOURCE_NAMES } from "@/features/news/constants";
import type { CategoryType, SourceType } from "@/features/news/types";

const baseArticle: NewsArticle = {
  id: "1",
  title: "Test",
  description: "",
  url: "https://example.com/1",
  imageUrl: null,
  source: SOURCE_NAMES.guardian,
  category: "technology",
  date: "2025-01-01T00:00:00Z",
};

const defaultParams = {
  excludedWriters: [] as string[],
  selectedSources: ["guardian"] as SourceType[],
  selectedCategories: ["technology"] as CategoryType[],
};

describe("filterArticles", () => {
  it("returns empty array when articles is empty", () => {
    expect(
      filterArticles([], defaultParams),
    ).toEqual([]);
  });

  it("filters by selectedSources: keeps article when source is allowed", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, source: SOURCE_NAMES.guardian },
    ];
    const result = filterArticles(articles, {
      ...defaultParams,
      selectedSources: ["guardian"],
    });
    expect(result).toHaveLength(1);
  });

  it("filters by selectedSources: excludes article when source is not in selectedSources", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, source: SOURCE_NAMES.nyt },
    ];
    const result = filterArticles(articles, {
      ...defaultParams,
      selectedSources: ["guardian"],
    });
    expect(result).toHaveLength(0);
  });

  it("filters by selectedCategories: keeps article when category is in selectedCategories", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, category: "technology" },
    ];
    const result = filterArticles(articles, {
      ...defaultParams,
      selectedCategories: ["technology", "business"],
    });
    expect(result).toHaveLength(1);
  });

  it("filters by selectedCategories: excludes article when category is not in selectedCategories", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, category: "sports" },
    ];
    const result = filterArticles(articles, {
      ...defaultParams,
      selectedCategories: ["technology"],
    });
    expect(result).toHaveLength(0);
  });

  it("keeps article without category when categories filter is applied", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, category: "" },
    ];
    const result = filterArticles(articles, defaultParams);
    expect(result).toHaveLength(1);
  });

  it("excludes article when author matches excluded writer (word boundary)", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, author: "John Smith" },
    ];
    const result = filterArticles(articles, {
      ...defaultParams,
      excludedWriters: ["John"],
    });
    expect(result).toHaveLength(0);
  });

  it("includes article when author does not match excluded writer", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, author: "Jane Doe" },
    ];
    const result = filterArticles(articles, {
      ...defaultParams,
      excludedWriters: ["John"],
    });
    expect(result).toHaveLength(1);
  });

  it("excludes article when author contains excluded writer as whole word", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, author: "Smith, John" },
    ];
    const result = filterArticles(articles, {
      ...defaultParams,
      excludedWriters: ["John"],
    });
    expect(result).toHaveLength(0);
  });

  it("includes article when author has excluded string only as substring (no word boundary)", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, author: "Johnny Cash" },
    ];
    const result = filterArticles(articles, {
      ...defaultParams,
      excludedWriters: ["John"],
    });
    expect(result).toHaveLength(1);
  });

  it("applies all filters together", () => {
    const articles: NewsArticle[] = [
      { ...baseArticle, id: "a", source: SOURCE_NAMES.guardian, category: "technology", author: "Alice" },
      { ...baseArticle, id: "b", source: SOURCE_NAMES.nyt, category: "technology", author: "Bob" },
      { ...baseArticle, id: "c", source: SOURCE_NAMES.guardian, category: "sports", author: "Carol" },
      { ...baseArticle, id: "d", source: SOURCE_NAMES.guardian, category: "technology", author: "John Doe" },
      { ...baseArticle, id: "e", source: SOURCE_NAMES.guardian, category: "technology", author: "Eve" },
    ];
    const result = filterArticles(articles, {
      excludedWriters: ["John"],
      selectedSources: ["guardian"],
      selectedCategories: ["technology"],
    });
    expect(result.map((a) => a.id)).toEqual(["a", "e"]);
  });
});
