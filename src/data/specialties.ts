import type { Specialty } from "@/types/coach";

export const SPECIALTIES = [
  { id: "zero-to-swim", label: "آموزش شنا از صفر" },
  { id: "kids-swim", label: "شنای کودکان" },
  { id: "womens-swim", label: "شنای بانوان" },
  { id: "technique", label: "اصلاح تکنیک شنا" },
  { id: "crawl", label: "شنای کرال" },
  { id: "competition", label: "آمادگی مسابقات" },
  { id: "butterfly", label: "شنای پروانه" },
] satisfies readonly Specialty[];
