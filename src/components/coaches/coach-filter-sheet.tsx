"use client";

import { SlidersHorizontalIcon } from "lucide-react";

import { ActiveFilterChips } from "@/components/coaches/active-filter-chips";
import { CoachFilters } from "@/components/coaches/coach-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  type CoachFilters as CoachFiltersState,
  type FilterKey,
} from "@/lib/coaches/discovery";
import { formatNumber } from "@/lib/format";

type CoachFilterSheetProps = {
  filters: CoachFiltersState;
  resultCount: number;
  activeCount: number;
  onChange: (
    patch: Partial<CoachFiltersState>,
    options?: { debounce?: boolean },
  ) => void;
  onRemove: (key: FilterKey) => void;
  onReset: () => void;
};

export function CoachFilterSheet({
  filters,
  resultCount,
  activeCount,
  onChange,
  onRemove,
  onReset,
}: CoachFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button type="button" variant="outline" className="lg:hidden" />}
      >
        <SlidersHorizontalIcon aria-hidden="true" />
        فیلترها
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-brand-navy text-xs text-white">
            {formatNumber(activeCount)}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>فیلترها</SheetTitle>
          <SheetDescription>
            شرط‌های خودت را انتخاب کن و نتیجه را همان لحظه ببین.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
          <CoachFilters filters={filters} onChange={onChange} />
          <ActiveFilterChips
            filters={filters}
            onRemove={onRemove}
            onReset={onReset}
          />
        </div>
        <SheetFooter>
          <SheetClose render={<Button type="button" />}>
            نمایش {formatNumber(resultCount)} مربی
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
