import type { Category, Source } from "@/features/news/api/lib/types";

export type Theme = "light" | "dark";

export interface PreferencesState {
  selectedCategories: Category[];
  selectedSources: Source[];
  excludedWriters: string[];
  theme: Theme;
}