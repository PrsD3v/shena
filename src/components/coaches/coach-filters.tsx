"use client";

import { useId } from "react";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AGE_GROUPS } from "@/data/age-groups";
import { CITIES } from "@/data/cities";
import { LEVELS } from "@/data/levels";
import { SPECIALTIES } from "@/data/specialties";
import {
  PRICE_BANDS,
  type CoachFilters as CoachFiltersState,
} from "@/lib/coaches/discovery";
import type { AgeGroupId, Gender, LevelId } from "@/types/coach";

const ALL = "all";

const CITY_ITEMS = [
  { value: ALL, label: "همه شهرها" },
  ...CITIES.map((city) => ({ value: city.id, label: city.label })),
];

const SPECIALTY_ITEMS = [
  { value: ALL, label: "همه تخصص‌ها" },
  ...SPECIALTIES.map((specialty) => ({
    value: specialty.id,
    label: specialty.label,
  })),
];

const LEVEL_ITEMS = [
  { value: ALL, label: "همه سطح‌ها" },
  ...LEVELS.map((level) => ({ value: level.id, label: level.label })),
];

const AGE_ITEMS = [
  { value: ALL, label: "همه گروه‌های سنی" },
  ...AGE_GROUPS.map((group) => ({ value: group.id, label: group.label })),
];

const PRICE_ITEMS = [
  { value: ALL, label: "همه قیمت‌ها" },
  ...PRICE_BANDS.map((band) => ({ value: band.id, label: band.label })),
];

const GENDER_ITEMS = [
  { value: ALL, label: "همه" },
  { value: "male", label: "آقا" },
  { value: "female", label: "خانم" },
];

type CoachFiltersProps = {
  filters: CoachFiltersState;
  onChange: (
    patch: Partial<CoachFiltersState>,
    options?: { debounce?: boolean },
  ) => void;
};

export function CoachFilters({ filters, onChange }: CoachFiltersProps) {
  const id = useId();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor={`${id}-q`} className="text-sm font-medium">
          جست‌وجو
        </label>
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id={`${id}-q`}
            type="search"
            value={filters.q}
            maxLength={60}
            placeholder="نام مربی یا تخصص"
            className="ps-9"
            onChange={(event) =>
              onChange({ q: event.target.value }, { debounce: true })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-city`} className="text-sm font-medium">
          شهر
        </label>
        <Select
          items={CITY_ITEMS}
          value={filters.city ?? ALL}
          onValueChange={(value) =>
            onChange({ city: value === ALL ? null : String(value) })
          }
        >
          <SelectTrigger id={`${id}-city`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITY_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-specialty`} className="text-sm font-medium">
          تخصص
        </label>
        <Select
          items={SPECIALTY_ITEMS}
          value={filters.specialty ?? ALL}
          onValueChange={(value) =>
            onChange({ specialty: value === ALL ? null : String(value) })
          }
        >
          <SelectTrigger id={`${id}-specialty`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPECIALTY_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-level`} className="text-sm font-medium">
          سطح
        </label>
        <Select
          items={LEVEL_ITEMS}
          value={filters.level ?? ALL}
          onValueChange={(value) =>
            onChange({ level: toLevelId(String(value)) })
          }
        >
          <SelectTrigger id={`${id}-level`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEVEL_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${id}-age`} className="text-sm font-medium">
          گروه سنی
        </label>
        <Select
          items={AGE_ITEMS}
          value={filters.age ?? ALL}
          onValueChange={(value) =>
            onChange({ age: toAgeGroupId(String(value)) })
          }
        >
          <SelectTrigger id={`${id}-age`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AGE_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">جنسیت مربی</legend>
        <SegmentedControl
          aria-label="جنسیت مربی"
          items={GENDER_ITEMS}
          value={filters.gender ?? ALL}
          onValueChange={(value) => onChange({ gender: toGender(value) })}
        />
      </fieldset>

      <div className="space-y-2">
        <label htmlFor={`${id}-price`} className="text-sm font-medium">
          بازه قیمت
        </label>
        <Select
          items={PRICE_ITEMS}
          value={filters.price ?? ALL}
          onValueChange={(value) =>
            onChange({ price: toPriceBand(String(value)) })
          }
        >
          <SelectTrigger id={`${id}-price`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRICE_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function toLevelId(value: string): LevelId | null {
  return LEVELS.some((entry) => entry.id === value)
    ? (value as LevelId)
    : null;
}

function toAgeGroupId(value: string): AgeGroupId | null {
  return AGE_GROUPS.some((entry) => entry.id === value)
    ? (value as AgeGroupId)
    : null;
}

function toGender(value: string): Gender | null {
  if (value === "male" || value === "female") return value;
  return null;
}

function toPriceBand(value: string): CoachFiltersState["price"] {
  const band = PRICE_BANDS.find((entry) => entry.id === value);
  return band ? band.id : null;
}
