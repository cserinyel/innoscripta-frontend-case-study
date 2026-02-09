import FilterInput from "@/components/shared/filterInput/filter-input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchInput = ({
  value,
  onChange,
  onSearch,
}: SearchInputProps): React.ReactElement => {
  return (
    <FilterInput
      value={value}
      onChange={onChange}
      onSubmit={onSearch}
      placeholder="Search articles by keyword"
      className="w-full md:flex-1 md:max-w-80"
    />
  );
};

export default SearchInput;
