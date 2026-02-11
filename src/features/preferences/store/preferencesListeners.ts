import { createListenerMiddleware } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { savePreferencesToStorage } from "../lib/utils";

export const preferencesListenerMiddleware = createListenerMiddleware();

preferencesListenerMiddleware.startListening({
  predicate: (action) => action.type.startsWith("preferences/"),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    savePreferencesToStorage(state.preferences);
  },
});
