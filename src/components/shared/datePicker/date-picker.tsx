import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const toDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  try {
    return parseISO(value);
  } catch {
    return undefined;
  }
};

const toDateString = (date: Date): string => format(date, "yyyy-MM-dd");

const DatePicker = ({
  value,
  onValueChange,
  placeholder = "Pick a date",
}: DatePickerProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);

  const handleSelect = (date: Date | undefined) => {
    onValueChange(date ? toDateString(date) : "");
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selected}
          className="data-[empty=true]:text-muted-foreground w-auto justify-start gap-2 text-left font-normal"
        >
          <CalendarIcon className="size-4" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
          {selected && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear date"
              className="hover:bg-muted -mr-1 ml-1 inline-flex size-5 items-center justify-center rounded-sm"
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
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
