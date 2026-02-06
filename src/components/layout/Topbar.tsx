import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function Topbar() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="bg-background/80 backdrop-blur sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3">
      <span className="text-lg font-semibold tracking-tight">NewsHub</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
    </header>
  );
}
