import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  selectTheme,
  toggleTheme,
  type Theme,
} from "@/features/preferences/store/preferencesSlice";

const applyThemeClass = (theme: Theme): void => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  return {
    theme,
    toggle: () => dispatch(toggleTheme()),
  } as const;
};
