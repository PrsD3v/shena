import { ensureDemoState } from "@/lib/demo";
import { createId } from "@/lib/ids";
import { getCoach, getPackage } from "@/lib/repositories/coaches";
import {
  isBooking,
  isClockTime,
  isIsoDate,
  isUnknownArray,
} from "@/lib/repositories/guards";
import { getPurchase } from "@/lib/repositories/purchases";
import { remainingSessions } from "@/lib/session-balance";
import { readLocalJson, STORAGE_KEYS, writeLocalJson } from "@/lib/storage";
import type {
  Booking,
  BookingAttendee,
  BookingLocation,
} from "@/types/booking";

export interface NewBookingInput {
  coachId: string;
  packageId: string;
  packagePurchaseId: string;
  location: BookingLocation;
  attendee: BookingAttendee;
  date: string;
  time: string;
}

export type CreateBookingResult =
  | { ok: true; booking: Booking; saved: boolean }
  | {
      ok: false;
      reason:
        | "invalid-date"
        | "invalid-time"
        | "unknown-coach"
        | "unknown-package"
        | "unknown-purchase"
        | "purchase-mismatch"
        | "slot-taken"
        | "no-sessions-remaining";
    };

export function listBookings(): Booking[] {
  ensureDemoState();
  const stored = readLocalJson(STORAGE_KEYS.bookings, isUnknownArray);
  return stored ? stored.filter(isBooking) : [];
}

export function getBooking(bookingId: string): Booking | null {
  return listBookings().find((booking) => booking.id === bookingId) ?? null;
}

export function createBooking(input: NewBookingInput): CreateBookingResult {
  ensureDemoState();
  if (!isIsoDate(input.date)) return { ok: false, reason: "invalid-date" };
  if (!isClockTime(input.time)) return { ok: false, reason: "invalid-time" };

  const coach = getCoach(input.coachId);
  if (!coach) return { ok: false, reason: "unknown-coach" };
  const pkg = getPackage(input.packageId);
  if (!pkg || pkg.coachId !== coach.id) {
    return { ok: false, reason: "unknown-package" };
  }
  const purchase = getPurchase(input.packagePurchaseId);
  if (!purchase) return { ok: false, reason: "unknown-purchase" };
  if (purchase.coachId !== coach.id || purchase.packageId !== pkg.id) {
    return { ok: false, reason: "purchase-mismatch" };
  }

  const bookings = listBookings();
  const slotTaken = bookings.some(
    (booking) =>
      booking.coachId === coach.id &&
      booking.date === input.date &&
      booking.time === input.time,
  );
  if (slotTaken) return { ok: false, reason: "slot-taken" };
  if (remainingSessions(purchase, bookings) <= 0) {
    return { ok: false, reason: "no-sessions-remaining" };
  }

  const booking: Booking = {
    id: createId("booking"),
    coachId: coach.id,
    packageId: pkg.id,
    packagePurchaseId: purchase.id,
    location: input.location,
    attendee: input.attendee,
    date: input.date,
    time: input.time,
    durationMinutes: coach.sessionDurationMinutes,
    priceToman: pkg.perSessionToman,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  const saved = writeLocalJson(STORAGE_KEYS.bookings, [booking, ...bookings]);
  return { ok: true, booking, saved };
}
