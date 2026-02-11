import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import PreferencesPanel from "@/features/preferences/components/preferences-panel/preferences-panel";
import { Settings } from "lucide-react";
import TestErrorBoundaryButton from "../../error-boundary/test-error-boundary-button";
import ThemeSwitcher from "../../shared/theme-switcher/theme-switcher";

const Topbar = (): React.ReactElement => {
  return (
    <header className="bg-background/80 backdrop-blur sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3">
      <span className="text-lg font-semibold tracking-tight">NewsHub</span>
      <div className="flex items-center gap-1">
        <TestErrorBoundaryButton />
        <ThemeSwitcher />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Preferences">
              <Settings className="size-5" />
            </Button>
          </SheetTrigger>
          <PreferencesPanel />
        </Sheet>
      </div>
    </header>
  );
};

export default Topbar;
