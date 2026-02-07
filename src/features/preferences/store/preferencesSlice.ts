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
}

const defaultState: PreferencesState = {
  selectedCategories: [...CATEGORIES],
  selectedSources: [...SOURCES],
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
  },
  selectors: {
    selectSelectedCategories: (state) => state.selectedCategories,
    selectSelectedSources: (state) => state.selectedSources,
  },
});

export const { toggleCategory, toggleSource, setCategories, setSources } =
  preferencesSlice.actions;

export const { selectSelectedCategories, selectSelectedSources } =
  preferencesSlice.selectors;

export default preferencesSlice.reducer;
