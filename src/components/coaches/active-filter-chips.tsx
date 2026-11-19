"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  buildFilterChips,
  type CoachFilters,
  type FilterKey,
} from "@/lib/coaches/discovery";

type ActiveFilterChipsProps = {
  filters: CoachFilters;
  onRemove: (key: FilterKey) => void;
  onReset: () => void;
};

export function ActiveFilterChips({
  filters,
  onRemove,
  onReset,
}: ActiveFilterChipsProps) {
  const chips = buildFilterChips(filters);
  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <span>{chip.label}</span>
          <XIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">حذف این فیلتر</span>
        </button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-brand-blue"
      >
        پاک کردن همه
      </Button>
    </div>
  );
}
