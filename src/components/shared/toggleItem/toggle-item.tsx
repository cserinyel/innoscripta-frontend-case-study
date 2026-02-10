import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const ToggleItem = ({
  label,
  active,
  onToggle,
  disabled,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}): React.ReactElement => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/40",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span className="capitalize">{label}</span>
      {active && <Check className="size-4" />}
    </button>
  );
};

export default ToggleItem;
