import { useRef } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";

const MAX_VISIBLE_CHIPS = 3;

const MultiSelectCombobox = ({
  label,
  items,
  value,
  onValueChange,
}: {
  label: string;
  items: readonly string[];
  value: string[];
  onValueChange: (value: string[]) => void;
}): React.ReactElement => {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const hasSelection = value.length > 0;
  const isCollapsed = value.length > MAX_VISIBLE_CHIPS;

  return (
    <Combobox
      items={[...items]}
      multiple
      value={value}
      onValueChange={onValueChange}
    >
      <ComboboxChips ref={anchorRef} className="w-96">
        <ComboboxValue>
          {isCollapsed ? (
            <span className="text-sm">
              {value.length} {label.toLowerCase()} selected
            </span>
          ) : (
            value.map((item) => <ComboboxChip key={item}>{item}</ComboboxChip>)
          )}
        </ComboboxValue>
        <ComboboxChipsInput placeholder={hasSelection ? undefined : label} />
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default MultiSelectCombobox;
