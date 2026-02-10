import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer, {
  toggleCategory,
  toggleSource,
  setCategories,
  setSources,
  addExcludedWriter,
  removeExcludedWriter,
  toggleTheme,
  clearPreferences,
  selectSelectedCategories,
  selectSelectedSources,
  selectExcludedWriters,
  selectTheme,
} from "./preferencesSlice";
import { STORAGE_KEY } from "../constants";
import { CATEGORIES, SOURCES } from "@/features/news/constants";

const createMockStorage = () => {
  let store: string | null = null;
  return {
    getItem: vi.fn((key: string) => (key === STORAGE_KEY ? store : null)),
    setItem: vi.fn((key: string, value: string) => {
      if (key === STORAGE_KEY) store = value;
    }),
    clear: vi.fn(() => {
      store = null;
    }),
  };
};

describe("preferencesSlice", () => {
  let mockStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    mockStorage = createMockStorage();
    vi.stubGlobal("localStorage", mockStorage);
  });

  const createStore = () =>
    configureStore({
      reducer: { preferences: preferencesReducer },
    });

  describe("loadFromStorage", () => {
    it("returns default state when localStorage is empty", () => {
      const store = createStore();
      expect(selectSelectedCategories(store.getState())).toEqual([...CATEGORIES]);
      expect(selectSelectedSources(store.getState())).toEqual([...SOURCES]);
      expect(selectExcludedWriters(store.getState())).toEqual([]);
      expect(selectTheme(store.getState())).toBe("light");
    });

    it("restores state from valid JSON in localStorage", () => {
      mockStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedCategories: ["technology", "sports"],
        selectedSources: ["guardian"],
        excludedWriters: ["Spam Author"],
        theme: "dark",
      }));
      const store = createStore();
      expect(selectSelectedCategories(store.getState())).toEqual(["technology", "sports"]);
      expect(selectSelectedSources(store.getState())).toEqual(["guardian"]);
      expect(selectExcludedWriters(store.getState())).toEqual(["Spam Author"]);
      expect(selectTheme(store.getState())).toBe("dark");
    });

    it("falls back to default state when JSON is invalid", () => {
      mockStorage.getItem.mockReturnValue("not valid json");
      const store = createStore();
      expect(selectSelectedCategories(store.getState())).toEqual([...CATEGORIES]);
      expect(selectSelectedSources(store.getState())).toEqual([...SOURCES]);
    });

    it("falls back to defaults for invalid categories in stored state", () => {
      mockStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedCategories: ["invalid-category"],
        selectedSources: ["guardian"],
        excludedWriters: [],
        theme: "light",
      }));
      const store = createStore();
      expect(selectSelectedCategories(store.getState())).toEqual([...CATEGORIES]);
    });

    it("falls back to defaults for invalid theme in stored state", () => {
      mockStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedCategories: [...CATEGORIES],
        selectedSources: [...SOURCES],
        excludedWriters: [],
        theme: "invalid",
      }));
      const store = createStore();
      expect(selectTheme(store.getState())).toBe("light");
    });
  });

  describe("reducers", () => {
    it("toggleCategory: adds category when not present, removes when present", () => {
      const store = createStore();
      store.dispatch(setCategories(["technology"]));

      store.dispatch(toggleCategory("sports"));
      expect(selectSelectedCategories(store.getState())).toContain("technology");
      expect(selectSelectedCategories(store.getState())).toContain("sports");

      store.dispatch(toggleCategory("technology"));
      expect(selectSelectedCategories(store.getState())).not.toContain("technology");
      expect(selectSelectedCategories(store.getState())).toContain("sports");
    });

    it("toggleSource: adds source when not present, removes when present", () => {
      const store = createStore();
      store.dispatch(setSources(["guardian"]));

      store.dispatch(toggleSource("nyt"));
      expect(selectSelectedSources(store.getState())).toContain("guardian");
      expect(selectSelectedSources(store.getState())).toContain("nyt");

      store.dispatch(toggleSource("guardian"));
      expect(selectSelectedSources(store.getState())).not.toContain("guardian");
      expect(selectSelectedSources(store.getState())).toContain("nyt");
    });

    it("addExcludedWriter: does not add duplicate", () => {
      const store = createStore();
      store.dispatch(addExcludedWriter("John"));
      store.dispatch(addExcludedWriter("John"));
      expect(selectExcludedWriters(store.getState())).toEqual(["John"]);
    });

    it("removeExcludedWriter: removes only when present", () => {
      const store = createStore();
      store.dispatch(addExcludedWriter("John"));
      store.dispatch(addExcludedWriter("Jane"));
      store.dispatch(removeExcludedWriter("John"));
      expect(selectExcludedWriters(store.getState())).toEqual(["Jane"]);
      store.dispatch(removeExcludedWriter("Unknown"));
      expect(selectExcludedWriters(store.getState())).toEqual(["Jane"]);
    });

    it("clearPreferences: resets to defaults but keeps current theme", () => {
      const store = createStore();
      store.dispatch(setCategories(["sports"]));
      store.dispatch(setSources(["nyt"]));
      store.dispatch(addExcludedWriter("Spam"));
      store.dispatch(toggleTheme());

      store.dispatch(clearPreferences());

      expect(selectSelectedCategories(store.getState())).toEqual([...CATEGORIES]);
      expect(selectSelectedSources(store.getState())).toEqual([...SOURCES]);
      expect(selectExcludedWriters(store.getState())).toEqual([]);
      expect(selectTheme(store.getState())).toBe("dark");
    });
  });
});
