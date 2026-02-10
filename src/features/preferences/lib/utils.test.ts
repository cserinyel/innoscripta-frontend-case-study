import { describe, it, expect, vi, beforeEach } from "vitest";
import { savePreferencesToStorage } from "./utils";
import { STORAGE_KEY } from "../constants";
import type { PreferencesState } from "../types";
import { CATEGORIES, SOURCES } from "@/features/news/constants";

describe("savePreferencesToStorage", () => {
  const setItem = vi.fn();

  beforeEach(() => {
    setItem.mockClear();
    vi.stubGlobal("localStorage", { setItem, getItem: vi.fn(), clear: vi.fn() });
  });

  it("calls localStorage.setItem with STORAGE_KEY and stringified state", () => {
    const state: PreferencesState = {
      selectedCategories: [...CATEGORIES],
      selectedSources: [...SOURCES],
      excludedWriters: ["Author"],
      theme: "dark",
    };
    savePreferencesToStorage(state);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(state));
  });
});
