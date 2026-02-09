import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const SingleSelectCombobox = ({
  label,
  items,
  value,
  onValueChange,
  className,
}: {
  label: string;
  items: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}): React.ReactElement => {
  return (
    <Combobox
      items={[...items]}
      value={value}
      onValueChange={(val) => onValueChange(val ?? "")}
    >
      <ComboboxInput placeholder={label} showClear={!!value} className={className} />
      <ComboboxContent>
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

export default SingleSelectCombobox;
