import { describe, it, expect } from "vitest";
import { normalizeGuardianResponse } from "./normalizer";
import type { GuardianResultDto } from "./types";
import { SOURCE_NAMES } from "@/features/news/constants";
import { generateArticleId } from "../../lib/utils";

const minimalGuardianResult = (
  overrides: Partial<GuardianResultDto> = {},
): GuardianResultDto => ({
  id: "id",
  type: "article",
  sectionId: "technology",
  sectionName: "Technology",
  webPublicationDate: "2025-01-15T12:00:00Z",
  webTitle: "Web Title",
  webUrl: "https://theguardian.com/world/2025/article",
  apiUrl: "https://api.example.com",
  isHosted: false,
  ...overrides,
});

describe("normalizeGuardianResponse", () => {
  it("maps GuardianResultDto to NewsArticle with correct fields", () => {
    const dto: GuardianResultDto = minimalGuardianResult({
      webUrl: "https://theguardian.com/tech/1",
      webTitle: "Fallback Title",
      fields: {
        headline: "Headline Title",
        trailText: "Description text",
        byline: "By John Smith",
        thumbnail: "https://example.com/thumb.jpg",
      },
    });
    const result = normalizeGuardianResponse([dto], "technology");
    expect(result).toHaveLength(1);
    const article = result[0];
    expect(article.id).toBe(generateArticleId(dto.webUrl));
    expect(article.title).toBe("Headline Title");
    expect(article.description).toBe("Description text");
    expect(article.url).toBe(dto.webUrl);
    expect(article.imageUrl).toBe("https://example.com/thumb.jpg");
    expect(article.author).toBe("By John Smith");
    expect(article.source).toBe(SOURCE_NAMES.guardian);
    expect(article.category).toBe("technology");
    expect(article.date).toBe("2025-01-15T12:00:00Z");
  });

  it("uses webTitle when fields.headline is missing", () => {
    const dto = minimalGuardianResult({
      webTitle: "Only Web Title",
      fields: { trailText: "" },
    });
    const result = normalizeGuardianResponse([dto], "general");
    expect(result[0].title).toBe("Only Web Title");
  });

  it("uses category param when provided, else derives from sectionId", () => {
    const dto = minimalGuardianResult({ sectionId: "sport" });
    const withCategory = normalizeGuardianResponse([dto], "sports");
    expect(withCategory[0].category).toBe("sports");
    const withoutCategory = normalizeGuardianResponse([dto], "");
    expect(withoutCategory[0].category).toBe("sports");
  });

  it("sets optional fields to null or empty when missing", () => {
    const dto = minimalGuardianResult({
      fields: undefined,
    });
    const result = normalizeGuardianResponse([dto], "technology");
    expect(result[0].description).toBe("");
    expect(result[0].imageUrl).toBeNull();
    expect(result[0].author).toBeNull();
  });

  it("maps multiple results", () => {
    const dtos = [
      minimalGuardianResult({ webUrl: "https://a.com/1", webTitle: "First" }),
      minimalGuardianResult({ webUrl: "https://a.com/2", webTitle: "Second" }),
    ];
    const result = normalizeGuardianResponse(dtos, "general");
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("First");
    expect(result[1].title).toBe("Second");
    expect(result[0].id).not.toBe(result[1].id);
  });
});
