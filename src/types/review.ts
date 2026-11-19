/** Seeded reviews have no `bookingId`; local reviews are one per booking. */
export interface Review {
  id: string;
  coachId: string;
  bookingId?: string;
  authorName: string;
  rating: number;
  text?: string;
  createdAt: string;
}
