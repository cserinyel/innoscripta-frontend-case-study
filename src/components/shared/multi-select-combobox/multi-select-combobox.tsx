import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const getPlaceholder = (
  label: string,
  selected: string[],
  nameMap?: Record<string, string>,
): string => {
  if (selected.length === 0) return label;
  if (selected.length === 1) return nameMap?.[selected[0]] ?? selected[0];
  return `${selected.length} selected`;
};

const MultiSelectCombobox = ({
  label,
  items,
  value,
  onValueChange,
  className,
  nameMap,
}: {
  label: string;
  items: readonly string[];
  value: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
  nameMap?: Record<string, string>;
}): React.ReactElement => {
  return (
    <Combobox
      multiple
      items={[...items]}
      value={value}
      onValueChange={onValueChange}
      itemToStringLabel={(id) => nameMap?.[id] ?? id}
    >
      <ComboboxInput
        placeholder={getPlaceholder(label, value, nameMap)}
        showClear={value.length > 0}
        className={cn(
          value.length > 0 && "[&_input]:placeholder:text-foreground",
          className,
        )}
      />
      <ComboboxContent>
        <ComboboxEmpty className="text-muted-foreground justify-start px-2">
          No items found.
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {nameMap?.[item] ?? item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default MultiSelectCombobox;
