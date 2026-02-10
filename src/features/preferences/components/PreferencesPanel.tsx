import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectSelectedCategories,
  selectSelectedSources,
  toggleCategory,
  toggleSource,
  clearPreferences,
} from "@/features/preferences/store/preferencesSlice";
import { CATEGORIES, SOURCE_NAMES, SOURCES } from "@/features/news/constants";
import type { Category, Source } from "@/features/news/api/lib/types";
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
import { ChevronDown, Trash2 } from "lucide-react";
import ToggleItem from "@/components/shared/toggleItem/toggle-item";
import AddWriterDialog from "@/features/preferences/components/addWriterDialog/add-writer-dialog";
import ExcludedWritersList from "@/features/preferences/components/excludedWritersList/excluded-writers-list";
import { toast } from "sonner";

const PreferencesPanel = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector(selectSelectedCategories);
  const selectedSources = useAppSelector(selectSelectedSources);
  const [writerDialogOpen, setWriterDialogOpen] = useState(false);

  const handleToggleSource = (source: Source) => {
    if (selectedSources.length === 1 && selectedSources.includes(source)) {
      toast.error("You must select at least one source.");
      return;
    }
    dispatch(toggleSource(source));
  };

  const handleToggleCategory = (category: Category) => {
    if (
      selectedCategories.length === 1 &&
      selectedCategories.includes(category)
    ) {
      toast.error("You must select at least one category.");
      return;
    }
    dispatch(toggleCategory(category));
  };

  return (
    <SheetContent side="right" className="overflow-hidden">
      <SheetHeader>
        <SheetTitle>Preferences</SheetTitle>
        <SheetDescription>
          Choose the categories and sources you want to see in your feed.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 pb-6 flex-1">
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
                  onToggle={() => handleToggleCategory(category)}
                  disabled={
                    selectedCategories.length === 1 &&
                    selectedCategories.includes(category)
                  }
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
                  label={SOURCE_NAMES[source]}
                  active={selectedSources.includes(source)}
                  onToggle={() => handleToggleSource(source)}
                  disabled={
                    selectedSources.length === 1 &&
                    selectedSources.includes(source)
                  }
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
      <div className="flex justify-end p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => dispatch(clearPreferences())}
        >
          <Trash2 className="size-3.5" />
          Clear Preferences
        </Button>
      </div>
    </SheetContent>
  );
};

export default PreferencesPanel;
