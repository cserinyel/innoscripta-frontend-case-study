import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

const SearchInput = () => {
  return (
    <InputGroup>
      <InputGroupAddon>
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search articles..." />
    </InputGroup>
  );
};

export default SearchInput;
