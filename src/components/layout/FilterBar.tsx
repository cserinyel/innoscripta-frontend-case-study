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
    <>
      <DatePicker
        value={date}
        onValueChange={onDateChange}
        placeholder="Pick a date"
        className="w-full md:w-48 md:flex-1"
      />
      <SingleSelectCombobox
        label="Source"
        items={preferredSources}
        value={activeSource}
        onValueChange={onSourceChange}
        className="w-full md:w-36 md:flex-1 md:max-w-48"
      />
      <SingleSelectCombobox
        label="Category"
        items={preferredCategories}
        value={activeCategory}
        onValueChange={onCategoryChange}
        className="w-full md:w-36 md:flex-1 md:max-w-48"
      />
    </>
  );
};

export default FilterBar;
