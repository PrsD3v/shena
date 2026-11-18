# Build Plan

> Shena marketplace demo, scoped by Mission 001 and
> [project-plan.md](project-plan.md). Student-facing, Persian, RTL, seeded data,
> local state. Each item is a feature-sized outcome; `/feature` turns one into a
> spec. Items stay unchecked until `/complete` archives them.

## Ordering rule

- No feature depends on data, state, components, validation, or storage that a
  later feature introduces. Each item is complete for what it claims.
- No screen ships a visible control whose destination does not exist. A route is
  built before anything links to it, or the same feature builds both ends.
- Important content is URL-addressable. A modal, sheet, or sidebar that reveals
  coach, booking, or receipt information mirrors its open state in the URL and
  has a full-page fallback. Overlays are never the only path to important
  information.
- Global chrome uses the standard Next.js App Router root layout at
  `src/app/layout.tsx`. No custom app-shell wrapper.
- The homepage is built after the marketplace routes it links into, so its
  search, featured cards, and calls to action land on real pages. This is the one
  intentional deviation from Mission 001's suggested order.

## Milestone 1 - Foundation

- [x] 1. **Design tokens, Persian typography, and Next.js root layout** - Shena
  color, radius, and spacing tokens in `globals.css`; self-hosted Vazirmatn; the
  standard `src/app/layout.tsx` with `<html lang="fa" dir="rtl">`; Toman, Persian
  digit, and Jalali date formatting utilities.
- [x] 2. **Shena component layer on Nova** - restyled button, input, select,
  badge, card, dialog, sheet, segmented control, rating, and empty-state
  primitives with consistent focus, radius, and motion behavior.
- [ ] 3. **Domain models, seeded data, and repositories** - typed coaches,
  specialties, cities, packages, package purchase records, reviews, availability,
  testimonials, and demo student; eight written coach profiles; safe versioned
  `localStorage` and `sessionStorage` helpers; coach, booking, favorite, review,
  and package purchase access modules; a derived remaining-session helper; demo
  reset helper.

## Milestone 2 - Discovery and comparison

- [ ] 4. **Global chrome, coach discovery, and coach profile** - header, footer,
  and RTL mobile navigation composed into the root layout; directory search by
  name and specialty, city, price, gender, specialty, level, and age-group
  filters, sorting, active chips, clear-all, result count, URL-query state,
  responsive grid, empty state, and persisted favorites; profile with
  certificates, experience, training locations, session duration, three packages
  with pricing, seeded reviews, verification badge, and favorite toggle. Cards
  link to profiles inside the same feature. Any coach preview overlay is
  deep-linked, the profile page is the share target, and a copy-link action sits
  on the profile.
- [ ] 5. **Homepage** - hero with curated swimming imagery loaded as asset-only
  requests, city and specialty search, featured coaches, popular specialties, how
  it works, trust indicators, testimonials, and closing call to action. Every
  link targets a route built in item 4.

## Milestone 3 - Booking

- [ ] 6. **Booking flow with day availability** - package selection, attendee
  step for the student or a child, training location, day-based Jalali
  availability and slot selection, Zod schemas, React Hook Form where it helps,
  Persian validation messages, and a `sessionStorage` draft that survives reload
  and navigation. The URL mirrors non-sensitive selections with URL-first
  precedence and carries the attendee type only; the child's name and age group
  stay in the draft and later in the local booking record. A copy-link action
  shares the selection, and the feature adds the booking entry point to the coach
  profile.
- [ ] 7. **Booking confirmation and simulated payment** - summary of coach,
  package, location, attendee, Jalali date and time, sessions, duration, and
  price; clearly labeled demo payment; success and cancel paths; booking written
  to `localStorage`, linked to its package purchase; the booked
  slot blocked afterwards. The remaining balance stays derived, and cancelled or
  unconfirmed bookings never consume a session. The success screen links home and
  to the dashboard once item 9 adds that route. A receipt is addressable by
  booking id and shows a clear not-found state when the id is missing locally.
- [ ] 8. **Week and month calendar views** - added on top of the day view, with
  per-day availability indicators, Jalali month navigation, and confirmed
  bookings reflected as taken.

## Milestone 4 - Dashboard and trust

- [ ] 9. **Student dashboard** - demo profile, upcoming and past bookings with
  details, remaining package sessions derived from each linked purchase and its
  confirmed or completed bookings, favorites list, empty states, demo-only
  complete action, and a reset action that clears only Shena's keys. Adds the
  dashboard entry to the header navigation and to the confirmation success
  state. A booking detail is addressable as `/dashboard?booking=<id>`.
- [ ] 10. **Reviews** - form offered for completed bookings without a review, one
  review per booking, 1 to 5 stars and optional text, local reviews merged into
  the profile and the rating average.

## Milestone 5 - Quality

- [ ] 11. **Motion and interaction polish** - Framer Motion for dialogs, cards,
  filtering, and success feedback, with reduced-motion support and no motion that
  carries meaning on its own.
- [ ] 12. **Responsive refinement** - intentional mobile compositions at 360px to
  430px, tablet at 768px, desktop at 1280px and above; RTL spacing, navigation,
  calendar, and dashboard on small screens; no horizontal overflow.
- [ ] 13. **Accessibility refinement** - keyboard paths, focus order and focus
  visibility, labels, dialog semantics, contrast, and image alternatives.
- [ ] 14. **Browser journey tests and final verification** - Playwright harness
  and journey coverage for search, filtering, profile, booking, persistence,
  dashboard, responsive checks, and copied deep links reopening the same view
  with working back and forward; package accounting checks that drafts and
  unconfirmed bookings never consume a session; checks that no child details
  appear in URLs; lint, typecheck, and build passing; final visual comparison
  against the reference.

## Dependency check

Every item depends only on earlier items, for behavior and for links.

| Item | Depends on | Why |
|---|---|---|
| 1 | none | Tokens, font, root layout, formatters |
| 2 | 1 | Components consume tokens |
| 3 | 1 | Models and storage use formatting and types |
| 4 | 1, 2, 3 | Chrome, directory, and profile need tokens, components, seed data, and storage |
| 5 | 1, 2, 3, 4 | Homepage links into the directory and profiles, and reuses the coach card |
| 6 | 1, 2, 3 | Booking needs packages, availability, validation, and storage; the profile entry point is navigation only |
| 7 | 1, 3, 6 | Confirmation consumes the booking draft and persists it |
| 8 | 3, 6, 7 | Calendar views extend the day view and show booked slots |
| 9 | 3, 4, 6, 7 | Dashboard reads bookings, favorites, and package balances built earlier |
| 10 | 3, 4, 9 | Reviews need completed bookings and the profile display |
| 11 | 1 to 10 | Motion applies to finished surfaces |
| 12 | 1 to 11 | Responsive work needs complete screens |
| 13 | 1 to 12 | Accessibility review needs final interactions |
| 14 | 1 to 13 | Journey tests need the finished flow |

No item introduces a requirement that a later item fulfills. The only forward
wiring is navigation: item 6 adds the profile booking action, and item 9 adds the
dashboard entries to the header and the confirmation screen, both after their
targets exist.
