import { Input } from "@/components/ui/input";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { SOURCES, CATEGORIES } from "@/data/mock-news";

export function FilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input type="date" className="w-auto" />
      <MultiSelectDropdown label="Source" options={SOURCES} />
      <MultiSelectDropdown label="Category" options={CATEGORIES} />
    </div>
  );
}
