const PERSIAN_LOCALE = "fa-IR";
const PERSIAN_CALENDAR = "persian";
const TEHRAN_TIME_ZONE = "Asia/Tehran";
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

const numberFormat = new Intl.NumberFormat(PERSIAN_LOCALE, {
  maximumFractionDigits: 0,
});

const ratingFormat = new Intl.NumberFormat(PERSIAN_LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const jalaliDateInUtc = new Intl.DateTimeFormat(PERSIAN_LOCALE, {
  calendar: PERSIAN_CALENDAR,
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const jalaliDateInTehran = new Intl.DateTimeFormat(PERSIAN_LOCALE, {
  calendar: PERSIAN_CALENDAR,
  timeZone: TEHRAN_TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});

const jalaliWeekdayInUtc = new Intl.DateTimeFormat(PERSIAN_LOCALE, {
  calendar: PERSIAN_CALENDAR,
  timeZone: "UTC",
  weekday: "long",
});

const jalaliWeekdayInTehran = new Intl.DateTimeFormat(PERSIAN_LOCALE, {
  calendar: PERSIAN_CALENDAR,
  timeZone: TEHRAN_TIME_ZONE,
  weekday: "long",
});

type ResolvedDate = {
  date: Date;
  timeZone: "UTC" | typeof TEHRAN_TIME_ZONE;
};

/** Replaces ASCII digits with Persian digits, leaving every other character alone. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** Formats a whole number with Persian digits and Persian thousands grouping. */
export function formatNumber(value: number): string {
  assertFinite(value);
  return numberFormat.format(value);
}

/** Formats a whole Toman amount with its unit. */
export function formatToman(value: number): string {
  return `${formatNumber(value)} تومان`;
}

/** Formats a 0 to 5 rating with one Persian fraction digit. */
export function formatRating(value: number): string {
  assertFinite(value);
  if (value < 0 || value > 5) {
    throw new RangeError(`Expected a rating between 0 and 5, received ${value}`);
  }
  return ratingFormat.format(value);
}

/** Formats a calendar date or an instant as a Jalali date. */
export function formatJalaliDate(value: string | Date): string {
  const { date, timeZone } = resolveDate(value);
  return (timeZone === "UTC" ? jalaliDateInUtc : jalaliDateInTehran).format(date);
}

/** Formats the Persian weekday name of a calendar date or an instant. */
export function formatJalaliWeekday(value: string | Date): string {
  const { date, timeZone } = resolveDate(value);
  return (timeZone === "UTC" ? jalaliWeekdayInUtc : jalaliWeekdayInTehran).format(
    date,
  );
}

/** Formats an `HH:mm` clock time with Persian digits. */
export function formatTime(time: string): string {
  if (!TIME_PATTERN.test(time)) {
    throw new RangeError(`Expected a 24-hour HH:mm time, received "${time}"`);
  }
  return toPersianDigits(time);
}

/** Formats a positive duration in minutes as Persian hours and minutes. */
export function formatDuration(minutes: number): string {
  assertFinite(minutes);
  if (minutes <= 0) {
    throw new RangeError(`Expected a positive duration, received ${minutes}`);
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${formatNumber(minutes)} دقیقه`;
  }
  if (remainingMinutes === 0) {
    return `${formatNumber(hours)} ساعت`;
  }
  return `${formatNumber(hours)} ساعت و ${formatNumber(remainingMinutes)} دقیقه`;
}

function resolveDate(value: string | Date): ResolvedDate {
  if (value instanceof Date) {
    assertValidDate(value, value.toString());
    return { date: value, timeZone: TEHRAN_TIME_ZONE };
  }

  if (DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new RangeError(`Invalid calendar date "${value}"`);
    }
    return { date, timeZone: "UTC" };
  }

  const date = new Date(value);
  assertValidDate(date, value);
  return { date, timeZone: TEHRAN_TIME_ZONE };
}

function assertValidDate(date: Date, source: string): void {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid date "${source}"`);
  }
}

function assertFinite(value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Expected a finite number, received ${value}`);
  }
}
