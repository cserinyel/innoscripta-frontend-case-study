import { Button } from "@/components/ui/button";
import { useTheme } from "@/features/preferences/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
