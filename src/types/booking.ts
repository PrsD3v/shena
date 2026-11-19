import type { AgeGroupId } from "@/types/coach";

export type BookingLocation = "coach-pool" | "student-pool";

export type AttendeeType = "self" | "child";

export type BookingStatus = "confirmed" | "completed";

export interface BookingAttendee {
  type: AttendeeType;
  childName?: string;
  childAgeGroup?: AgeGroupId;
}

/**
 * Child details live only here and in the session draft, never in a URL.
 * `date` is an ISO calendar date and `time` is `HH:mm` in Tehran local time.
 */
export interface Booking {
  id: string;
  coachId: string;
  packageId: string;
  packagePurchaseId: string;
  location: BookingLocation;
  attendee: BookingAttendee;
  date: string;
  time: string;
  durationMinutes: number;
  priceToman: number;
  status: BookingStatus;
  createdAt: string;
}

export interface PackagePurchase {
  id: string;
  coachId: string;
  packageId: string;
  includedSessions: number;
  createdAt: string;
}
