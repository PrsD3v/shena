"use client";

import { useEffect, useRef, useState } from "react";

import { ActiveFilterChips } from "@/components/coaches/active-filter-chips";
import { CoachFilterSheet } from "@/components/coaches/coach-filter-sheet";
import { CoachFilters } from "@/components/coaches/coach-filters";
import { CoachResults } from "@/components/coaches/coach-results";
import { SortSelect } from "@/components/coaches/sort-select";
import { Button } from "@/components/ui/button";
import {
  buildCoachQuery,
  clearFilter,
  countActiveFilters,
  EMPTY_FILTERS,
  filterCoaches,
  sortCoaches,
  type CoachFilters as CoachFiltersState,
  type FilterKey,
} from "@/lib/coaches/discovery";
import { formatNumber } from "@/lib/format";
import type { Coach } from "@/types/coach";

type CoachDirectoryProps = {
  coaches: readonly Coach[];
  initialFilters: CoachFiltersState;
};

export function CoachDirectory({
  coaches,
  initialFilters,
}: CoachDirectoryProps) {
  const [filters, setFilters] = useState(initialFilters);
  const urlTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (urlTimer.current) clearTimeout(urlTimer.current);
    };
  }, []);

  function commitUrl(next: CoachFiltersState, delay = 0) {
    if (urlTimer.current) clearTimeout(urlTimer.current);
    const url = `${window.location.pathname}${buildCoachQuery(next)}`;
    if (delay === 0) {
      window.history.replaceState(window.history.state, "", url);
      return;
    }
    urlTimer.current = setTimeout(() => {
      window.history.replaceState(window.history.state, "", url);
    }, delay);
  }

  function update(
    patch: Partial<CoachFiltersState>,
    options?: { debounce?: boolean },
  ) {
    const next = { ...filters, ...patch };
    setFilters(next);
    commitUrl(next, options?.debounce ? 250 : 0);
  }

  function removeFilter(key: FilterKey) {
    const next = clearFilter(filters, key);
    setFilters(next);
    commitUrl(next);
  }

  function resetFilters() {
    const next = { ...EMPTY_FILTERS, sort: filters.sort };
    setFilters(next);
    commitUrl(next);
  }

  const results = sortCoaches(filterCoaches(coaches, filters), filters.sort);
  const activeCount = countActiveFilters(filters);

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
      <aside aria-label="فیلترهای جست‌وجو" className="hidden lg:block">
        <div className="sticky top-24 space-y-5 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-brand-navy">فیلترها</h2>
            {activeCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={resetFilters}
                className="text-brand-blue"
              >
                پاک کردن
              </Button>
            )}
          </div>
          <CoachFilters filters={filters} onChange={update} />
        </div>
      </aside>

      <section aria-labelledby="coach-results-title" className="min-w-0">
        <h2 id="coach-results-title" className="sr-only">
          نتیجه جست‌وجوی مربیان
        </h2>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p
            aria-live="polite"
            className="text-sm font-medium text-muted-foreground"
          >
            {formatNumber(results.length)} مربی
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <CoachFilterSheet
              filters={filters}
              resultCount={results.length}
              activeCount={activeCount}
              onChange={update}
              onRemove={removeFilter}
              onReset={resetFilters}
            />
            <SortSelect
              sort={filters.sort}
              onChange={(sort) => update({ sort })}
            />
          </div>
        </div>

        <ActiveFilterChips
          filters={filters}
          onRemove={removeFilter}
          onReset={resetFilters}
        />

        <CoachResults coaches={results} onReset={resetFilters} />
      </section>
    </div>
  );
}
