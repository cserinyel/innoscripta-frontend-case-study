import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  CATEGORIES,
  SOURCES,
} from "@/features/news/constants";
import type { CategoryType, SourceType } from "@/features/news/types";
import type { PreferencesState } from "../types";
import { loadFromStorage, savePreferencesToStorage } from "../lib/utils";

const defaultState: PreferencesState = {
  selectedCategories: [...CATEGORIES],
  selectedSources: [...SOURCES],
  excludedWriters: [],
  theme: "light",
};

const initialState = loadFromStorage() || defaultState;

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleCategory(state, action: PayloadAction<CategoryType>) {
      const idx = state.selectedCategories.indexOf(action.payload);
      if (idx === -1) {
        state.selectedCategories.push(action.payload);
      } else {
        state.selectedCategories.splice(idx, 1);
      }
      savePreferencesToStorage(state);
    },

    toggleSource(state, action: PayloadAction<SourceType>) {
      const idx = state.selectedSources.indexOf(action.payload);
      if (idx === -1) {
        state.selectedSources.push(action.payload);
      } else {
        state.selectedSources.splice(idx, 1);
      }
      savePreferencesToStorage(state);
    },

    setCategories(state, action: PayloadAction<CategoryType[]>) {
      state.selectedCategories = action.payload;
      savePreferencesToStorage(state);
    },

    setSources(state, action: PayloadAction<SourceType[]>) {
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

    clearPreferences(state) {
      const newState: PreferencesState = {
        ...defaultState,
        theme: state.theme,
      };

      savePreferencesToStorage(newState);
      return newState;
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
  clearPreferences,
} = preferencesSlice.actions;

export const {
  selectSelectedCategories,
  selectSelectedSources,
  selectExcludedWriters,
  selectTheme,
} = preferencesSlice.selectors;

export default preferencesSlice.reducer;
