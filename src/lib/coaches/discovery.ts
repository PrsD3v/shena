import { AGE_GROUPS } from "@/data/age-groups";
import { CITIES } from "@/data/cities";
import { LEVELS } from "@/data/levels";
import { SPECIALTIES } from "@/data/specialties";
import type { AgeGroupId, Coach, Gender, LevelId } from "@/types/coach";

const MAX_QUERY_LENGTH = 60;

export const PRICE_BANDS = [
  { id: "under-700", label: "زیر ۷۰۰ هزار تومان" },
  { id: "700-850", label: "۷۰۰ تا ۸۵۰ هزار تومان" },
  { id: "over-850", label: "بیش از ۸۵۰ هزار تومان" },
] as const;

export type PriceBandId = (typeof PRICE_BANDS)[number]["id"];

export const SORT_OPTIONS = [
  { id: "recommended", label: "پیشنهاد شنا" },
  { id: "rating", label: "بیشترین امتیاز" },
  { id: "price-asc", label: "ارزان‌ترین" },
  { id: "price-desc", label: "گران‌ترین" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export type FilterKey =
  | "q"
  | "city"
  | "specialty"
  | "level"
  | "age"
  | "gender"
  | "price";

export interface CoachFilters {
  q: string;
  city: string | null;
  specialty: string | null;
  level: LevelId | null;
  age: AgeGroupId | null;
  gender: Gender | null;
  price: PriceBandId | null;
  sort: SortId;
}

export interface FilterChip {
  key: FilterKey;
  label: string;
}

export type SearchParamsInput = Record<
  string,
  string | string[] | undefined
>;

export const EMPTY_FILTERS: CoachFilters = {
  q: "",
  city: null,
  specialty: null,
  level: null,
  age: null,
  gender: null,
  price: null,
  sort: "recommended",
};

export function parseCoachFilters(params: SearchParamsInput): CoachFilters {
  const query = readParam(params, "q") ?? "";
  const city = readParam(params, "city");
  const specialty = readParam(params, "specialty");
  const level = readParam(params, "level");
  const age = readParam(params, "age");
  const gender = readParam(params, "gender");
  const price = readParam(params, "price");
  const sort = readParam(params, "sort");

  return {
    q: query.slice(0, MAX_QUERY_LENGTH),
    city: hasId(CITIES, city) ? city : null,
    specialty: hasId(SPECIALTIES, specialty) ? specialty : null,
    level: LEVELS.some((entry) => entry.id === level)
      ? (level as LevelId)
      : null,
    age: AGE_GROUPS.some((entry) => entry.id === age)
      ? (age as AgeGroupId)
      : null,
    gender: gender === "male" || gender === "female" ? gender : null,
    price: PRICE_BANDS.some((band) => band.id === price)
      ? (price as PriceBandId)
      : null,
    sort: SORT_OPTIONS.some((option) => option.id === sort)
      ? (sort as SortId)
      : "recommended",
  };
}

export function buildCoachQuery(filters: CoachFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.city) params.set("city", filters.city);
  if (filters.specialty) params.set("specialty", filters.specialty);
  if (filters.level) params.set("level", filters.level);
  if (filters.age) params.set("age", filters.age);
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.price) params.set("price", filters.price);
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function filterCoaches(
  coaches: readonly Coach[],
  filters: CoachFilters,
): Coach[] {
  const query = normalizeSearchText(filters.q);

  return coaches.filter((coach) => {
    if (query) {
      const haystack = normalizeSearchText(
        [coach.name, ...coach.specialtyIds.map(getSpecialtyLabel)].join(" "),
      );
      if (!haystack.includes(query)) return false;
    }
    if (filters.city && coach.cityId !== filters.city) return false;
    if (filters.specialty && !coach.specialtyIds.includes(filters.specialty)) {
      return false;
    }
    if (filters.level && !coach.levelIds.includes(filters.level)) return false;
    if (filters.age && !coach.ageGroupIds.includes(filters.age)) return false;
    if (filters.gender && coach.gender !== filters.gender) return false;
    if (!matchesPriceBand(coach.sessionPriceToman, filters.price)) return false;
    return true;
  });
}

export function sortCoaches(
  coaches: readonly Coach[],
  sort: SortId,
): Coach[] {
  const sorted = [...coaches];
  switch (sort) {
    case "rating":
      return sorted.sort(
        (left, right) =>
          right.rating - left.rating || right.reviewCount - left.reviewCount,
      );
    case "price-asc":
      return sorted.sort(
        (left, right) =>
          left.sessionPriceToman - right.sessionPriceToman ||
          right.rating - left.rating,
      );
    case "price-desc":
      return sorted.sort(
        (left, right) =>
          right.sessionPriceToman - left.sessionPriceToman ||
          right.rating - left.rating,
      );
    default:
      return sorted.sort(
        (left, right) =>
          Number(right.verified) - Number(left.verified) ||
          right.rating - left.rating ||
          right.reviewCount - left.reviewCount,
      );
  }
}

export function countActiveFilters(filters: CoachFilters): number {
  return (
    Number(Boolean(filters.q)) +
    [
      filters.city,
      filters.specialty,
      filters.level,
      filters.age,
      filters.gender,
      filters.price,
    ].filter(Boolean).length
  );
}

export function buildFilterChips(filters: CoachFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  if (filters.q) chips.push({ key: "q", label: `جست‌وجو: ${filters.q}` });
  if (filters.city) {
    chips.push({ key: "city", label: getCityLabel(filters.city) });
  }
  if (filters.specialty) {
    chips.push({ key: "specialty", label: getSpecialtyLabel(filters.specialty) });
  }
  if (filters.level) {
    chips.push({ key: "level", label: getLevelLabel(filters.level) });
  }
  if (filters.age) {
    chips.push({ key: "age", label: getAgeGroupLabel(filters.age) });
  }
  if (filters.gender) {
    chips.push({ key: "gender", label: getGenderLabel(filters.gender) });
  }
  if (filters.price) {
    chips.push({ key: "price", label: getPriceBandLabel(filters.price) });
  }
  return chips;
}

export function clearFilter(
  filters: CoachFilters,
  key: FilterKey,
): CoachFilters {
  switch (key) {
    case "q":
      return { ...filters, q: "" };
    case "city":
      return { ...filters, city: null };
    case "specialty":
      return { ...filters, specialty: null };
    case "level":
      return { ...filters, level: null };
    case "age":
      return { ...filters, age: null };
    case "gender":
      return { ...filters, gender: null };
    case "price":
      return { ...filters, price: null };
  }
}

export function getCityLabel(cityId: string): string {
  return CITIES.find((city) => city.id === cityId)?.label ?? "شهر نامشخص";
}

export function getSpecialtyLabel(specialtyId: string): string {
  return (
    SPECIALTIES.find((specialty) => specialty.id === specialtyId)?.label ??
    "تخصص نامشخص"
  );
}

export function getLevelLabel(levelId: LevelId): string {
  return LEVELS.find((level) => level.id === levelId)?.label ?? "سطح نامشخص";
}

export function getAgeGroupLabel(ageGroupId: AgeGroupId): string {
  return (
    AGE_GROUPS.find((group) => group.id === ageGroupId)?.label ??
    "گروه سنی نامشخص"
  );
}

export function getGenderLabel(gender: Gender): string {
  return gender === "male" ? "مربی آقا" : "مربی خانم";
}

export function getPriceBandLabel(price: PriceBandId): string {
  return (
    PRICE_BANDS.find((band) => band.id === price)?.label ?? "بازه قیمت نامشخص"
  );
}

/** Folds Arabic letter variants and the zero-width non-joiner into a searchable form. */
export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\u200c/g, " ")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ");
}

function matchesPriceBand(
  priceToman: number,
  band: PriceBandId | null,
): boolean {
  if (!band) return true;
  if (band === "under-700") return priceToman < 700_000;
  if (band === "700-850") {
    return priceToman >= 700_000 && priceToman <= 850_000;
  }
  return priceToman > 850_000;
}

function readParam(params: SearchParamsInput, key: string): string | null {
  const value = params[key];
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed ? trimmed : null;
}

function hasId(
  entries: readonly { id: string }[],
  value: string | null,
): value is string {
  return value !== null && entries.some((entry) => entry.id === value);
}
