import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  selectTheme,
  toggleTheme,
} from "@/features/preferences/store/preferencesSlice";

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return {
    theme,
    toggle: () => dispatch(toggleTheme()),
  } as const;
};
