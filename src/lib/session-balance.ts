import type { Booking, PackagePurchase } from "@/types/booking";

const COUNTED_STATUSES: readonly Booking["status"][] = [
  "confirmed",
  "completed",
];

export function countSessionsUsed(
  packagePurchaseId: string,
  bookings: readonly Booking[],
): number {
  return bookings.filter(
    (booking) =>
      booking.packagePurchaseId === packagePurchaseId &&
      COUNTED_STATUSES.includes(booking.status),
  ).length;
}

/** Remaining sessions are always derived; nothing stores a balance. */
export function remainingSessions(
  purchase: PackagePurchase,
  bookings: readonly Booking[],
): number {
  return Math.max(
    0,
    purchase.includedSessions - countSessionsUsed(purchase.id, bookings),
  );
}
