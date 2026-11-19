import type { Certificate } from "@/types/coach";

const SWIM_FEDERATION = "فدراسیون شنا، شیرجه و واترپلو";
const LIFESAVING_FEDERATION = "فدراسیون نجات غریق و غواصی";
const RED_CRESCENT = "جمعیت هلال احمر";

export const CERTIFICATES = [
  {
    id: "coaching-1",
    label: "مربیگری درجه ۱ شنا",
    issuer: SWIM_FEDERATION,
    year: 1402,
  },
  {
    id: "coaching-2",
    label: "مربیگری درجه ۲ شنا",
    issuer: SWIM_FEDERATION,
    year: 1400,
  },
  {
    id: "coaching-3",
    label: "مربیگری درجه ۳ شنا",
    issuer: SWIM_FEDERATION,
    year: 1398,
  },
  {
    id: "kids-specialist",
    label: "مربیگری شنای کودکان",
    issuer: SWIM_FEDERATION,
    year: 1400,
  },
  {
    id: "lifesaving-1",
    label: "نجات غریق درجه ۱",
    issuer: LIFESAVING_FEDERATION,
    year: 1399,
  },
  {
    id: "lifesaving-2",
    label: "نجات غریق درجه ۲",
    issuer: LIFESAVING_FEDERATION,
    year: 1397,
  },
  {
    id: "first-aid",
    label: "کمک‌های اولیه",
    issuer: RED_CRESCENT,
    year: 1401,
  },
  {
    id: "cpr",
    label: "احیای قلبی ریوی",
    issuer: RED_CRESCENT,
    year: 1402,
  },
  {
    id: "water-therapy",
    label: "آب‌درمانی و شنای درمانی",
    issuer: "دانشگاه علوم پزشکی تهران",
    year: 1396,
  },
  {
    id: "competition-referee",
    label: "داوری مسابقات شنا",
    issuer: SWIM_FEDERATION,
    year: 1401,
  },
] satisfies readonly Certificate[];
