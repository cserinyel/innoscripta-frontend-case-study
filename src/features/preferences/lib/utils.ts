import { STORAGE_KEY } from "../constants";
import type { PreferencesState } from "../types";

export const savePreferencesToStorage = (state: PreferencesState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}