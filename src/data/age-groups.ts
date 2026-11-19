import type { AgeGroup } from "@/types/coach";

export const AGE_GROUPS = [
  { id: "children", label: "کودکان" },
  { id: "teen", label: "نوجوانان" },
  { id: "adult", label: "بزرگسالان" },
] satisfies readonly AgeGroup[];
