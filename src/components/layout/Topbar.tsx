import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import PreferencesPanel from "@/features/preferences/components/PreferencesPanel";
import { Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "@/features/preferences/hooks/useTheme";

const Topbar = (): React.ReactElement => {
  const { theme, toggle } = useTheme();

  return (
    <header className="bg-background/80 backdrop-blur sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3">
      <span className="text-lg font-semibold tracking-tight">NewsHub</span>
      <div className="flex items-center gap-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Preferences">
              <Settings className="size-5" />
            </Button>
          </SheetTrigger>
          <PreferencesPanel />
        </Sheet>
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
      </div>
    </header>
  );
};

export default Topbar;
