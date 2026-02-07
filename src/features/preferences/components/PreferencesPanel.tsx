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
import ToggleItem from "@/components/shared/toggleItem/toggle-item";

const PreferencesPanel = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector(selectSelectedCategories);
  const selectedSources = useAppSelector(selectSelectedSources);

  return (
    <SheetContent side="right" className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Preferences</SheetTitle>
        <SheetDescription>
          Choose the categories and sources you want to see in your feed.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-8 px-4 pb-6">
        <section className="space-y-3">
          <h3 className="text-sm font-medium">Categories</h3>
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
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-medium">Sources</h3>
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
        </section>
      </div>
    </SheetContent>
  );
};

export default PreferencesPanel;
