import { AVAILABILITY_PATTERNS } from "@/data/availability";
import { DEMO_STUDENT } from "@/data/demo-student";
import { PACKAGES } from "@/data/packages";
import {
  clearShenaStorage,
  isStorageAvailable,
  readLocalText,
  STORAGE_KEYS,
  STORAGE_VERSION,
  writeLocalJson,
  writeLocalText,
} from "@/lib/storage";
import type {
  AvailabilityPattern,
  Weekday,
  WeeklyAvailability,
} from "@/types/coach";
import type { Booking, PackagePurchase } from "@/types/booking";
import type { Review } from "@/types/review";

const DEMO_COACH_ID = "ali-rezaei";
const DEMO_PACKAGE_ID = "pkg-ali-rezaei-5";
const DEMO_FAVORITE_COACH_IDS = ["sara-mohammadi", "mehdi-jafari"];
const DEMO_SESSION_OFFSET_MINUTES = 60;

const TEHRAN_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export interface DemoHistory {
  purchase: PackagePurchase;
  bookings: Booking[];
  reviews: Review[];
  favoriteCoachIds: string[];
}

export type DemoStateStatus = "ready" | "seeded" | "reset" | "unavailable";

/**
 * The seeded demo history: one part-used five-session purchase with two
 * completed bookings (the older one reviewed) and one upcoming booking.
 * Dates follow the coach's weekly pattern so the calendar lines up later.
 */
export function createDemoHistory(now: Date = new Date()): DemoHistory {
  const pattern = requirePattern(DEMO_COACH_ID);
  const pkg = PACKAGES.find((entry) => entry.id === DEMO_PACKAGE_ID);
  if (!pkg) throw new Error(`Missing seed package ${DEMO_PACKAGE_ID}`);

  const upcoming = nextWorkingDate(tehranDate(now), pattern.weekly);
  const time = demoTime(upcoming.slot);
  const olderDate = addDays(upcoming.date, -14);
  const newerDate = addDays(upcoming.date, -7);
  const purchase: PackagePurchase = {
    id: "demo-purchase-1",
    coachId: DEMO_COACH_ID,
    packageId: pkg.id,
    includedSessions: pkg.sessionCount,
    createdAt: instantAt(addDays(olderDate, -1)),
  };

  const demoBooking = (
    id: string,
    status: Booking["status"],
    date: string,
  ): Booking => ({
    id,
    coachId: DEMO_COACH_ID,
    packageId: pkg.id,
    packagePurchaseId: purchase.id,
    location: "coach-pool",
    attendee: { type: "self" },
    date,
    time,
    durationMinutes: pattern.sessionDurationMinutes,
    priceToman: pkg.perSessionToman,
    status,
    createdAt: instantAt(addDays(date, -2)),
  });

  return {
    purchase,
    bookings: [
      demoBooking("demo-booking-upcoming", "confirmed", upcoming.date),
      demoBooking("demo-booking-completed-2", "completed", newerDate),
      demoBooking("demo-booking-completed-1", "completed", olderDate),
    ],
    reviews: [
      {
        id: "demo-review-1",
        coachId: DEMO_COACH_ID,
        bookingId: "demo-booking-completed-1",
        authorName: DEMO_STUDENT.name,
        rating: 5,
        text: "دوره پنج جلسه‌ای را با علی رضایی گذراندم و توانستم کرال را کامل شنا کنم. توضیح‌ها ساده و تمرین‌ها منظم بود.",
        createdAt: instantAt(addDays(olderDate, 1)),
      },
    ],
    favoriteCoachIds: [...DEMO_FAVORITE_COACH_IDS],
  };
}

/** Seeds the demo history on first run and after a version change. */
export function ensureDemoState(now: Date = new Date()): DemoStateStatus {
  if (!isStorageAvailable("local")) return "unavailable";
  const version = readLocalText(STORAGE_KEYS.version);
  if (version === String(STORAGE_VERSION)) return "ready";
  if (!clearShenaStorage()) return "unavailable";
  return seedDemoState(now) ? "seeded" : "unavailable";
}

/** Clears only Shena's keys and writes a fresh demo history. */
export function resetDemoData(now: Date = new Date()): DemoStateStatus {
  if (!isStorageAvailable("local")) return "unavailable";
  if (!clearShenaStorage()) return "unavailable";
  return seedDemoState(now) ? "reset" : "unavailable";
}

function seedDemoState(now: Date): boolean {
  const history = createDemoHistory(now);
  const written =
    writeLocalJson(STORAGE_KEYS.bookings, history.bookings) &&
    writeLocalJson(STORAGE_KEYS.purchases, [history.purchase]) &&
    writeLocalJson(STORAGE_KEYS.reviews, history.reviews) &&
    writeLocalJson(STORAGE_KEYS.favorites, history.favoriteCoachIds);
  if (!written) return false;
  return writeLocalText(STORAGE_KEYS.version, String(STORAGE_VERSION));
}

function requirePattern(coachId: string): AvailabilityPattern {
  const pattern = AVAILABILITY_PATTERNS.find(
    (entry) => entry.coachId === coachId,
  );
  if (!pattern) throw new Error(`Missing availability seed for ${coachId}`);
  return pattern;
}

function nextWorkingDate(
  from: string,
  weekly: readonly WeeklyAvailability[],
): { date: string; slot: WeeklyAvailability } {
  let date = addDays(from, 1);
  for (let offset = 0; offset < 14; offset += 1) {
    const slot = weekly.find((entry) => entry.weekday === weekdayOf(date));
    if (slot) return { date, slot };
    date = addDays(date, 1);
  }
  throw new Error("No weekly availability found for the demo coach");
}

function demoTime(slot: WeeklyAvailability): string {
  const candidate = addMinutes(slot.startTime, DEMO_SESSION_OFFSET_MINUTES);
  return candidate < slot.endTime ? candidate : slot.startTime;
}

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const total = Math.min(hours * 60 + mins + minutes, 23 * 60 + 59);
  const hour = String(Math.floor(total / 60)).padStart(2, "0");
  const minute = String(total % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

function tehranDate(value: Date): string {
  return TEHRAN_DATE.format(value);
}

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

function weekdayOf(date: string): Weekday {
  const [year, month, day] = date.split("-").map(Number);
  const jsDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return ((jsDay + 1) % 7) as Weekday;
}

function instantAt(date: string): string {
  return new Date(`${date}T12:00:00.000Z`).toISOString();
}
