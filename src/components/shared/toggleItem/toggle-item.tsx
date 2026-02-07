import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const ToggleItem = ({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}): React.ReactElement => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/40",
      )}
    >
      <span className="capitalize">{label}</span>
      {active && <Check className="size-4" />}
    </button>
  );
};

export default ToggleItem;