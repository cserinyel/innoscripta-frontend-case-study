import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <InputGroup className="w-full md:flex-1 md:max-w-80">
      <InputGroupAddon>
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="Search articles by keyword"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </InputGroup>
  );
};

export default SearchInput;
