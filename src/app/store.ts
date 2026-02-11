import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "@/features/preferences/store/preferencesSlice";
import { preferencesListenerMiddleware } from "@/features/preferences/store/preferencesListeners";
import { loadFromStorage } from "@/features/preferences/lib/utils";

const preloadedPreferences = loadFromStorage();

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
  },
  preloadedState: preloadedPreferences
    ? { preferences: preloadedPreferences }
    : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(preferencesListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
