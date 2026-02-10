import type { CategoryType, SourceType } from "@/features/news/types";

export type Theme = "light" | "dark";

export interface PreferencesState {
  selectedCategories: CategoryType[];
  selectedSources: SourceType[];
  excludedWriters: string[];
  theme: Theme;
}