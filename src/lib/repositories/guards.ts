import type { Booking, BookingAttendee } from "@/types/booking";
import type { PackagePurchase } from "@/types/booking";
import type { Review } from "@/types/review";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isClockTime(value: unknown): value is string {
  return typeof value === "string" && TIME_PATTERN.test(value);
}

export function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isBooking(value: unknown): value is Booking {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.coachId === "string" &&
    typeof value.packageId === "string" &&
    typeof value.packagePurchaseId === "string" &&
    (value.location === "coach-pool" || value.location === "student-pool") &&
    isAttendee(value.attendee) &&
    isIsoDate(value.date) &&
    isClockTime(value.time) &&
    Number.isInteger(value.durationMinutes) &&
    Number.isInteger(value.priceToman) &&
    (value.status === "confirmed" || value.status === "completed") &&
    typeof value.createdAt === "string"
  );
}

export function isPurchase(value: unknown): value is PackagePurchase {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.coachId === "string" &&
    typeof value.packageId === "string" &&
    typeof value.includedSessions === "number" &&
    Number.isInteger(value.includedSessions) &&
    value.includedSessions > 0 &&
    typeof value.createdAt === "string"
  );
}

export function isReview(value: unknown): value is Review {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.coachId === "string" &&
    (value.bookingId === undefined || typeof value.bookingId === "string") &&
    typeof value.authorName === "string" &&
    typeof value.rating === "number" &&
    Number.isInteger(value.rating) &&
    value.rating >= 1 &&
    value.rating <= 5 &&
    (value.text === undefined || typeof value.text === "string") &&
    typeof value.createdAt === "string"
  );
}

function isAttendee(value: unknown): value is BookingAttendee {
  if (!isRecord(value)) return false;
  if (value.type !== "self" && value.type !== "child") return false;
  const nameOk =
    value.childName === undefined || typeof value.childName === "string";
  const ageOk =
    value.childAgeGroup === undefined ||
    value.childAgeGroup === "children" ||
    value.childAgeGroup === "teen" ||
    value.childAgeGroup === "adult";
  return nameOk && ageOk;
}
