import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectExcludedWriters,
  removeExcludedWriter,
} from "@/features/preferences/store/preferencesSlice";
import FilterInput from "@/components/shared/filterInput/filter-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const ExcludedWritersList = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const excludedWriters = useAppSelector(selectExcludedWriters);
  const [search, setSearch] = useState("");

  const filteredWriters = useMemo(() => {
    if (search.trim().length === 0) return excludedWriters;
    const term = search.toLowerCase();
    return excludedWriters.filter((w) => w.toLowerCase().includes(term));
  }, [excludedWriters, search]);

  if (excludedWriters.length === 0) {
    return (
      <p className="text-muted-foreground text-xs">No excluded writers yet.</p>
    );
  }

  return (
    <div className="space-y-2">
      <FilterInput
        value={search}
        onChange={setSearch}
        placeholder="Search writers"
        clearable
      />

      <ScrollArea className="h-[168px]">
        <ul className="space-y-0.5 pr-2">
          {filteredWriters.map((writer) => (
            <li
              key={writer}
              className="flex items-center justify-between rounded px-2 py-0.5 text-xs hover:bg-accent"
            >
              <span className="truncate">{writer}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0"
                onClick={() => dispatch(removeExcludedWriter(writer))}
                aria-label={`Remove ${writer}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default ExcludedWritersList;
