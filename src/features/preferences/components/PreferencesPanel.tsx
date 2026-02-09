import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectSelectedCategories,
  selectSelectedSources,
  toggleCategory,
  toggleSource,
} from "@/features/preferences/store/preferencesSlice";
import { CATEGORIES, SOURCES, type Category, type Source } from "@/constants";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import ToggleItem from "@/components/shared/toggleItem/toggle-item";
import AddWriterDialog from "@/features/preferences/components/addWriterDialog/add-writer-dialog";
import ExcludedWritersList from "@/features/preferences/components/excludedWritersList/excluded-writers-list";

const PreferencesPanel = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector(selectSelectedCategories);
  const selectedSources = useAppSelector(selectSelectedSources);
  const [writerDialogOpen, setWriterDialogOpen] = useState(false);

  return (
    <SheetContent side="right" className="overflow-hidden">
      <SheetHeader>
        <SheetTitle>Preferences</SheetTitle>
        <SheetDescription>
          Choose the categories and sources you want to see in your feed.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 pb-6">
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between text-sm font-medium">
              Categories
              <ChevronDown className="size-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((category: Category) => (
                <ToggleItem
                  key={category}
                  label={category}
                  active={selectedCategories.includes(category)}
                  onToggle={() => dispatch(toggleCategory(category))}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between text-sm font-medium">
              Sources
              <ChevronDown className="size-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="grid grid-cols-1 gap-2">
              {SOURCES.map((source: Source) => (
                <ToggleItem
                  key={source}
                  label={source}
                  active={selectedSources.includes(source)}
                  onToggle={() => dispatch(toggleSource(source))}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between text-sm font-medium">
              Excluded Writers
              <ChevronDown className="size-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setWriterDialogOpen(true)}
            >
              Add Excluded Writer
            </Button>
            <ExcludedWritersList />
            <AddWriterDialog
              open={writerDialogOpen}
              onOpenChange={setWriterDialogOpen}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </SheetContent>
  );
};

export default PreferencesPanel;
