import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  from: string;
  to: string;
  onValueChange: (from: string, to: string) => void;
  placeholder?: string;
  className?: string;
}

const today = new Date();

const toDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  try {
    return parseISO(value);
  } catch {
    return undefined;
  }
};

const toDateString = (date: Date): string => format(date, "yyyy-MM-dd");

const formatRangeLabel = (
  from: Date | undefined,
  to: Date | undefined,
): string | null => {
  if (!from) return null;
  if (!to) return format(from, "PPP");
  if (from.getFullYear() === to.getFullYear()) {
    return `${format(from, "MMM d")} - ${format(to, "MMM d, yyyy")}`;
  }
  return `${format(from, "PPP")} - ${format(to, "PPP")}`;
};

const DatePicker = ({
  from,
  to,
  onValueChange,
  placeholder = "Pick a date range",
  className,
}: DatePickerProps): React.ReactElement => {
  const [open, setOpen] = useState(false);

  const selectedFrom = toDate(from);
  const selectedTo = toDate(to);
  const hasSelection = !!selectedFrom;

  const selected: DateRange | undefined = selectedFrom
    ? { from: selectedFrom, to: selectedTo }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    const newFrom = range?.from ? toDateString(range.from) : "";
    const newTo = range?.to ? toDateString(range.to) : "";
    onValueChange(newFrom, newTo);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("", "");
    setOpen(false);
  };

  const label = formatRangeLabel(selectedFrom, selectedTo);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-empty={!hasSelection}
          className={cn(
            "border-input dark:bg-input/30 flex h-9 w-auto items-center rounded-md border bg-transparent px-2.5 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 md:text-sm",
            "data-[empty=true]:text-muted-foreground text-left font-normal",
            className,
          )}
        >
          <CalendarIcon className="text-muted-foreground mr-2 size-4 shrink-0" />
          <span className="flex-1 truncate">
            {label ?? placeholder}
          </span>
          {hasSelection && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear date range"
              className="hover:bg-muted -mr-1 ml-1.5 inline-flex size-6 shrink-0 items-center justify-center rounded-[min(var(--radius-md),8px)]"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
            >
              <X className="size-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          disabled={{ after: today }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
