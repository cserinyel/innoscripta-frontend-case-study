import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import {
  selectSelectedCategories,
  selectSelectedSources,
} from "@/features/preferences/store/preferencesSlice";
import { Input } from "@/components/ui/input";
import MultiSelectCombobox from "../shared/multiSelectCombobox/multi-select-combobox";

const FilterBar = (): React.ReactElement => {
  const preferredSources = useAppSelector(selectSelectedSources);
  const preferredCategories = useAppSelector(selectSelectedCategories);

  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input type="date" className="w-auto" />
      <MultiSelectCombobox
        label="Source"
        items={preferredSources}
        value={activeSources}
        onValueChange={setActiveSources}
      />
      <MultiSelectCombobox
        label="Category"
        items={preferredCategories}
        value={activeCategories}
        onValueChange={setActiveCategories}
      />
    </div>
  );
};

export default FilterBar;
