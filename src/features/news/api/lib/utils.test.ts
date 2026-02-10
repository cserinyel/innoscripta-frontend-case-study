import { describe, it, expect } from "vitest";
import {
  generateArticleId,
  isApiError,
  getErrorMessage,
  getCategoryBySourceId,
  getSourceToCategoryMap,
} from "./utils";

describe("generateArticleId", () => {
  it("returns same output for same input", () => {
    const url = "https://example.com/article/123";
    expect(generateArticleId(url)).toBe(generateArticleId(url));
  });

  it("returns different output for different inputs", () => {
    expect(generateArticleId("https://a.com")).not.toBe(generateArticleId("https://b.com"));
  });

  it("returns a non-empty string", () => {
    expect(generateArticleId("https://example.com")).toBeTruthy();
    expect(typeof generateArticleId("x")).toBe("string");
  });
});

describe("isApiError", () => {
  it("returns true for object with string message", () => {
    expect(isApiError({ message: "API error" })).toBe(true);
    expect(isApiError({ message: "Fail", status: 500 })).toBe(true);
  });

  it("returns true for Error instance (has message string)", () => {
    expect(isApiError(new Error("err"))).toBe(true);
  });

  it("returns false for null and non-objects", () => {
    expect(isApiError(null)).toBe(false);
    expect(isApiError(undefined)).toBe(false);
    expect(isApiError("error")).toBe(false);
    expect(isApiError(42)).toBe(false);
  });

  it("returns false when message is not a string", () => {
    expect(isApiError({ message: 123 })).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("returns message for ApiError-shaped object", () => {
    expect(getErrorMessage({ message: "API error" })).toBe("API error");
  });

  it("returns message for Error instance", () => {
    expect(getErrorMessage(new Error("Something failed"))).toBe("Something failed");
  });

  it("returns fallback for unknown error types", () => {
    expect(getErrorMessage("string")).toBe("An unexpected error occurred");
    expect(getErrorMessage(null)).toBe("An unexpected error occurred");
  });
});

describe("getSourceToCategoryMap", () => {
  it("builds reverse lookup from category -> sources", () => {
    const sourcesMap = {
      tech: ["s1", "s2"],
      news: ["s3"],
    };
    expect(getSourceToCategoryMap(sourcesMap)).toEqual({
      s1: "tech",
      s2: "tech",
      s3: "news",
    });
  });
});

describe("getCategoryBySourceId", () => {
  const map = { section1: "technology", section2: "sports" };

  it("returns category when sourceId is in map", () => {
    expect(getCategoryBySourceId(map, "section1")).toBe("technology");
    expect(getCategoryBySourceId(map, "section2")).toBe("sports");
  });

  it("returns 'general' for null or unknown sourceId", () => {
    expect(getCategoryBySourceId(map, null)).toBe("general");
    expect(getCategoryBySourceId(map, "unknown")).toBe("general");
  });
});
