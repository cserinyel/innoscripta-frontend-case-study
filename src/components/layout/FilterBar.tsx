import { useAppSelector } from "@/app/hooks";
import {
  selectSelectedCategories,
  selectSelectedSources,
} from "@/features/preferences/store/preferencesSlice";
import SingleSelectCombobox from "../shared/singleSelectCombobox/single-select-combobox";
import DatePicker from "../shared/datePicker/date-picker";

interface FilterBarProps {
  activeSource: string;
  onSourceChange: (source: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  date: string;
  onDateChange: (date: string) => void;
}

const FilterBar = ({
  activeSource,
  onSourceChange,
  activeCategory,
  onCategoryChange,
  date,
  onDateChange,
}: FilterBarProps): React.ReactElement => {
  const preferredSources = useAppSelector(selectSelectedSources);
  const preferredCategories = useAppSelector(selectSelectedCategories);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DatePicker
        value={date}
        onValueChange={onDateChange}
        placeholder="Pick a date"
      />
      <SingleSelectCombobox
        label="Source"
        items={preferredSources}
        value={activeSource}
        onValueChange={onSourceChange}
      />
      <SingleSelectCombobox
        label="Category"
        items={preferredCategories}
        value={activeCategory}
        onValueChange={onCategoryChange}
      />
    </div>
  );
};

export default FilterBar;
