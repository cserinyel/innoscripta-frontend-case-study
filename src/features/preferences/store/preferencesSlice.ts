import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  CATEGORIES,
  SOURCES,
} from "@/features/news/constants";
import type { Category, Source } from "@/features/news/api/lib/types";
import { STORAGE_KEY } from "../constants";
import type { PreferencesState } from "../types";
import { savePreferencesToStorage } from "../lib/utils";

const defaultState: PreferencesState = {
  selectedCategories: [...CATEGORIES],
  selectedSources: [...SOURCES],
  excludedWriters: [],
  theme: "light",
};

const loadFromStorage = (): PreferencesState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
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
    return defaultState;
  }
}

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: loadFromStorage,
  reducers: {
    toggleCategory(state, action: PayloadAction<Category>) {
      const idx = state.selectedCategories.indexOf(action.payload);
      if (idx === -1) {
        state.selectedCategories.push(action.payload);
      } else {
        state.selectedCategories.splice(idx, 1);
      }
      savePreferencesToStorage(state);
    },

    toggleSource(state, action: PayloadAction<Source>) {
      const idx = state.selectedSources.indexOf(action.payload);
      if (idx === -1) {
        state.selectedSources.push(action.payload);
      } else {
        state.selectedSources.splice(idx, 1);
      }
      savePreferencesToStorage(state);
    },

    setCategories(state, action: PayloadAction<Category[]>) {
      state.selectedCategories = action.payload;
      savePreferencesToStorage(state);
    },

    setSources(state, action: PayloadAction<Source[]>) {
      state.selectedSources = action.payload;
      savePreferencesToStorage(state);
    },

    addExcludedWriter(state, action: PayloadAction<string>) {
      if (!state.excludedWriters.includes(action.payload)) {
        state.excludedWriters.push(action.payload);
        savePreferencesToStorage(state);
      }
    },

    removeExcludedWriter(state, action: PayloadAction<string>) {
      const idx = state.excludedWriters.indexOf(action.payload);
      if (idx !== -1) {
        state.excludedWriters.splice(idx, 1);
        savePreferencesToStorage(state);
      }
    },

    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      savePreferencesToStorage(state);
    },
  },
  selectors: {
    selectSelectedCategories: (state) => state.selectedCategories,
    selectSelectedSources: (state) => state.selectedSources,
    selectExcludedWriters: (state) => state.excludedWriters,
    selectTheme: (state) => state.theme,
  },
});

export const {
  toggleCategory,
  toggleSource,
  setCategories,
  setSources,
  addExcludedWriter,
  removeExcludedWriter,
  toggleTheme,
} = preferencesSlice.actions;

export const {
  selectSelectedCategories,
  selectSelectedSources,
  selectExcludedWriters,
  selectTheme,
} = preferencesSlice.selectors;

export default preferencesSlice.reducer;
