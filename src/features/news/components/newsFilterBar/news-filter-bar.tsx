import { useAppSelector } from "@/app/hooks";
import {
  selectSelectedCategories,
  selectSelectedSources,
} from "@/features/preferences/store/preferencesSlice";
import SingleSelectCombobox from "../../../../components/shared/singleSelectCombobox/single-select-combobox";
import MultiSelectCombobox from "../../../../components/shared/multiSelectCombobox/multi-select-combobox";
import DatePicker from "../../../../components/shared/datePicker/date-picker";
import { CATEGORY_NAMES, SOURCE_NAMES } from "@/features/news/constants";
import type { CategoryType, SourceType } from "@/features/news/types";

interface NewsFilterBarProps {
  activeSources: SourceType[];
  onSourcesChange: (sources: SourceType[]) => void;
  activeCategory: CategoryType | "";
  onCategoryChange: (category: CategoryType) => void;
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
}

const NewsFilterBar = ({
  activeSources,
  onSourcesChange,
  activeCategory,
  onCategoryChange,
  dateFrom,
  dateTo,
  onDateChange,
}: NewsFilterBarProps): React.ReactElement => {
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
        onValueChange={(sources) => onSourcesChange(sources as SourceType[])}
        className="w-full md:w-36 md:flex-1 md:max-w-48"
        nameMap={SOURCE_NAMES}
      />
      <SingleSelectCombobox
        label="Category"
        items={preferredCategories}
        value={activeCategory}
        onValueChange={(category) => onCategoryChange(category as CategoryType)}
        className="w-full md:w-36 md:flex-1 md:max-w-48"
        nameMap={CATEGORY_NAMES}
      />
    </>
  );
};

export default NewsFilterBar;
