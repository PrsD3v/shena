import { SEEDED_REVIEWS } from "@/data/reviews";
import { ensureDemoState } from "@/lib/demo";
import { createId } from "@/lib/ids";
import { getBooking } from "@/lib/repositories/bookings";
import { getCoach } from "@/lib/repositories/coaches";
import { isReview, isUnknownArray } from "@/lib/repositories/guards";
import { readLocalJson, STORAGE_KEYS, writeLocalJson } from "@/lib/storage";
import type { Review } from "@/types/review";

export interface RatingSummary {
  rating: number;
  reviewCount: number;
}

export type CreateReviewResult =
  | { ok: true; review: Review; saved: boolean }
  | {
      ok: false;
      reason:
        | "invalid-rating"
        | "empty-author"
        | "unknown-booking"
        | "booking-not-completed"
        | "duplicate-review";
    };

export function listLocalReviews(): Review[] {
  ensureDemoState();
  const stored = readLocalJson(STORAGE_KEYS.reviews, isUnknownArray);
  return stored ? stored.filter(isReview) : [];
}

export function getReviewForBooking(bookingId: string): Review | null {
  return (
    listLocalReviews().find((review) => review.bookingId === bookingId) ?? null
  );
}

export function listReviewsForCoach(coachId: string): Review[] {
  const local = listLocalReviews().filter(
    (review) => review.coachId === coachId,
  );
  const seeded = SEEDED_REVIEWS.filter((review) => review.coachId === coachId);
  return [...local, ...seeded]
    .map((review) => ({ ...review }))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getRatingSummary(coachId: string): RatingSummary | null {
  const coach = getCoach(coachId);
  if (!coach) return null;

  const localReviews = listLocalReviews().filter(
    (review) => review.coachId === coachId,
  );
  const reviewCount = coach.reviewCount + localReviews.length;
  if (reviewCount === 0) return { rating: 0, reviewCount: 0 };

  const total =
    coach.rating * coach.reviewCount +
    localReviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    rating: Math.round((total / reviewCount) * 10) / 10,
    reviewCount,
  };
}

export function createReview(input: {
  bookingId: string;
  coachId: string;
  authorName: string;
  rating: number;
  text?: string;
}): CreateReviewResult {
  ensureDemoState();
  if (
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    return { ok: false, reason: "invalid-rating" };
  }
  const authorName = input.authorName.trim();
  if (!authorName) return { ok: false, reason: "empty-author" };

  const booking = getBooking(input.bookingId);
  if (!booking || booking.coachId !== input.coachId) {
    return { ok: false, reason: "unknown-booking" };
  }
  if (booking.status !== "completed") {
    return { ok: false, reason: "booking-not-completed" };
  }
  if (getReviewForBooking(booking.id)) {
    return { ok: false, reason: "duplicate-review" };
  }

  const text = input.text?.trim();
  const review: Review = {
    id: createId("review"),
    coachId: booking.coachId,
    bookingId: booking.id,
    authorName,
    rating: input.rating,
    ...(text ? { text } : {}),
    createdAt: new Date().toISOString(),
  };
  const saved = writeLocalJson(STORAGE_KEYS.reviews, [
    review,
    ...listLocalReviews(),
  ]);
  return { ok: true, review, saved };
}
