import { CATEGORIES, SOURCES } from "@/features/news/constants";
import { STORAGE_KEY } from "../constants";
import type { PreferencesState } from "../types";

export const savePreferencesToStorage = (state: PreferencesState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const loadFromStorage = (): PreferencesState | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw) as Partial<PreferencesState>;

    const state: PreferencesState = {
      selectedCategories:
        Array.isArray(parsed.selectedCategories) &&
        parsed.selectedCategories.every((c) =>
          (CATEGORIES as readonly string[]).includes(c),
        )
          ? parsed.selectedCategories
          : [...CATEGORIES],
      selectedSources:
        Array.isArray(parsed.selectedSources) &&
        parsed.selectedSources.every((s) =>
          (SOURCES as readonly string[]).includes(s),
        )
          ? parsed.selectedSources
          : [...SOURCES],
      excludedWriters:
        Array.isArray(parsed.excludedWriters) &&
        parsed.excludedWriters.every((w) => typeof w === "string")
          ? parsed.excludedWriters
          : [],
      theme:
        parsed.theme === "light" || parsed.theme === "dark"
          ? parsed.theme
          : "light",
    };

    return state;
  } catch {
    return undefined;
  }
}