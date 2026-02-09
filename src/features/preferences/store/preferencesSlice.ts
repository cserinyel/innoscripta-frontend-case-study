import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  CATEGORIES,
  SOURCES,
  type Category,
  type Source,
} from "@/constants";

const STORAGE_KEY = "newshub_preferences";

export interface PreferencesState {
  selectedCategories: Category[];
  selectedSources: Source[];
  excludedWriters: string[];
}

const defaultState: PreferencesState = {
  selectedCategories: [...CATEGORIES],
  selectedSources: [...SOURCES],
  excludedWriters: [],
};

const loadFromStorage = (): PreferencesState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as Partial<PreferencesState>;

    return {
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
    };
  } catch {
    return defaultState;
  }
}

const saveToStorage = (state: PreferencesState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
      saveToStorage(state);
    },

    toggleSource(state, action: PayloadAction<Source>) {
      const idx = state.selectedSources.indexOf(action.payload);
      if (idx === -1) {
        state.selectedSources.push(action.payload);
      } else {
        state.selectedSources.splice(idx, 1);
      }
      saveToStorage(state);
    },

    setCategories(state, action: PayloadAction<Category[]>) {
      state.selectedCategories = action.payload;
      saveToStorage(state);
    },

    setSources(state, action: PayloadAction<Source[]>) {
      state.selectedSources = action.payload;
      saveToStorage(state);
    },

    addExcludedWriter(state, action: PayloadAction<string>) {
      if (!state.excludedWriters.includes(action.payload)) {
        state.excludedWriters.push(action.payload);
        saveToStorage(state);
      }
    },

    removeExcludedWriter(state, action: PayloadAction<string>) {
      const idx = state.excludedWriters.indexOf(action.payload);
      if (idx !== -1) {
        state.excludedWriters.splice(idx, 1);
        saveToStorage(state);
      }
    },
  },
  selectors: {
    selectSelectedCategories: (state) => state.selectedCategories,
    selectSelectedSources: (state) => state.selectedSources,
    selectExcludedWriters: (state) => state.excludedWriters,
  },
});

export const {
  toggleCategory,
  toggleSource,
  setCategories,
  setSources,
  addExcludedWriter,
  removeExcludedWriter,
} = preferencesSlice.actions;

export const {
  selectSelectedCategories,
  selectSelectedSources,
  selectExcludedWriters,
} = preferencesSlice.selectors;

export default preferencesSlice.reducer;
