"use client";

import { useId } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, type SortId } from "@/lib/coaches/discovery";

const SORT_ITEMS = SORT_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
}));

type SortSelectProps = {
  sort: SortId;
  onChange: (sort: SortId) => void;
};

export function SortSelect({ sort, onChange }: SortSelectProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-muted-foreground">
        ترتیب
      </label>
      <Select
        items={SORT_ITEMS}
        value={sort}
        onValueChange={(value) => {
          const next = SORT_OPTIONS.find((option) => option.id === value);
          if (next) onChange(next.id);
        }}
      >
        <SelectTrigger id={id} size="sm" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
