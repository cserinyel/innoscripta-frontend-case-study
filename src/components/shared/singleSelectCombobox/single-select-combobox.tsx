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
}: {
  label: string;
  items: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
}): React.ReactElement => {
  return (
    <Combobox
      items={[...items]}
      value={value}
      onValueChange={(val) => onValueChange(val ?? "")}
    >
      <ComboboxInput placeholder={label} showClear={!!value} />
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
