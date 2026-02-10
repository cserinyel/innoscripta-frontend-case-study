import { useAppSelector } from "@/app/hooks";
import {
  selectSelectedCategories,
  selectSelectedSources,
} from "@/features/preferences/store/preferencesSlice";
import SingleSelectCombobox from "../shared/singleSelectCombobox/single-select-combobox";
import MultiSelectCombobox from "../shared/multiSelectCombobox/multi-select-combobox";
import DatePicker from "../shared/datePicker/date-picker";
import { CATEGORY_NAMES, SOURCE_NAMES } from "@/features/news/constants";

interface FilterBarProps {
  activeSources: string[];
  onSourcesChange: (sources: string[]) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
}

const FilterBar = ({
  activeSources,
  onSourcesChange,
  activeCategory,
  onCategoryChange,
  dateFrom,
  dateTo,
  onDateChange,
}: FilterBarProps): React.ReactElement => {
  const preferredSources = useAppSelector(selectSelectedSources);
  const preferredCategories = useAppSelector(selectSelectedCategories);

  return (
    <>
      <DatePicker
        from={dateFrom}
        to={dateTo}
        onValueChange={onDateChange}
        placeholder="Pick a date range"
        className="w-full md:w-64 md:flex-1"
      />
      <MultiSelectCombobox
        label="Source"
        items={preferredSources}
        value={activeSources}
        onValueChange={onSourcesChange}
        className="w-full md:w-36 md:flex-1 md:max-w-48"
        nameMap={SOURCE_NAMES}
      />
      <SingleSelectCombobox
        label="Category"
        items={preferredCategories}
        value={activeCategory}
        onValueChange={onCategoryChange}
        className="w-full md:w-36 md:flex-1 md:max-w-48"
        nameMap={CATEGORY_NAMES}
      />
    </>
  );
};

export default FilterBar;
