# Shena - Project Overview

<!-- blueprint:source-hash 588bfcd0c19545de89bf06c37efcb8a383e819c0978fa72c05a81cae526fa113 -->

> Persian, RTL swimming-coach discovery and lesson-booking demo: search coaches,
> compare credentials and prices, book a Jalali-dated lesson, and manage local
> bookings in this browser only.

## Problem

Persian-speaking people in Iran have no central way to find and compare qualified
swimming coaches; discovery happens through Instagram, referrals, pool staff, and
scattered ads, so every option must be compared by hand coach by coach. Shena
centralizes discovery, comparison, and booking in one Persian RTL interface and
demonstrates that journey end to end.

## Users

The acting user is the student; coaches, admins, and support staff are not actors
in this build.

- **Beginners** learning to swim for the first time.
- **Parents** arranging lessons for a child.
- **Adults improving technique** (stroke, breathing, endurance).
- **Competitive swimmers** preparing for competition.
- **Women** seeking a female instructor or a private setting.
- **Private-lesson seekers** who want to compare options before booking.

Access tier: a single fixed demo student, no sign-in or gate.

## Usage model

- Frontend demo only: no backend, API, database, or server-side availability;
  one browser's local state is the whole data store.
- No authentication, accounts, sessions, or permissions; the dashboard is open.
- Payment is simulated; no gateway, no card data, no claim that money moved.
- Local availability is not a reservation system; the interface must not imply
  production locking, multi-user concurrency, or cross-device sync.
- Coach gender is public and filterable; no visitor is hidden or restricted by
  their own gender. Student gender and preferences are never shown publicly.
- Privacy: no user, child, booking, favorite, or profile data leaves the browser.
  No analytics, tracking, advertising, or unnecessary third-party scripts. The
  only external requests are curated swimming image assets, which carry no demo
  state or identifier.
- Explicit non-goals: real auth, OTP/SMS, database, Prisma, backend, payment
  gateway, notifications, coach/admin dashboards, payouts, commission, disputes,
  booking locks, concurrency, real-time sync, mobile apps, chat, wallet, coupons,
  subscriptions, referrals, AI recommendations, multi-language support, SEO
  strategy, hosted deployment.

## Features

Build order from `blueprint/build-plan.md`. **Headline:** the booking flow
(items 6-8) - package, attendee, Jalali availability, simulated payment, and a
persisted confirmation.

1. **Design tokens, Persian typography, and root layout** - Shena color/radius/
   spacing tokens, self-hosted Vazirmatn, `src/app/layout.tsx` with `lang="fa"
   dir="rtl"`, Toman/Persian-digit/Jalali formatters.
2. **Shena component layer on Nova** - restyled button, input, select, badge,
   card, dialog, sheet, segmented control, rating, empty state.
3. **Domain models, seeded data, repositories** - typed seeded content, eight
   written coaches, versioned local/session storage helpers, access modules,
   derived remaining-session helper, demo reset.
4. **Global chrome, discovery, profile** - header/footer/RTL mobile nav, search,
   seven filters, sorting, chips, URL-query state, responsive grid, favorites;
   profile with certificates, locations, three packages, reviews, copy-link.
5. **Homepage** - hero with curated swimming imagery, city/specialty search,
   featured coaches, specialties, how it works, trust indicators, testimonials,
   closing CTA, all linking to routes from item 4.
6. **Booking flow with day availability** - package, attendee (self/child),
   location, day-based Jalali slots, Zod validation, `sessionStorage` draft,
   URL-mirrored non-sensitive selections, copy-link, profile entry point.
7. **Booking confirmation and simulated payment** - summary, demo payment,
   success/cancel, booking persisted and linked to its package purchase, slot
   blocked afterwards, addressable receipt.
8. **Week and month calendar views** - per-day indicators, Jalali month
   navigation, confirmed bookings shown as taken.
9. **Student dashboard** - demo profile, upcoming/past bookings, derived
   remaining sessions, favorites, empty states, demo complete action, scoped
   reset; `/dashboard?booking=<id>` detail.
10. **Reviews** - form for completed bookings without a review, one per booking,
    1-5 stars, optional text, merged into profile and average.
11. **Motion and interaction polish** - Framer Motion for dialogs, cards,
    filtering, success feedback, reduced-motion support.
12. **Responsive refinement** - intentional mobile compositions, RTL spacing and
    calendar on small screens, no horizontal overflow.
13. **Accessibility refinement** - keyboard paths, focus order/visibility,
    labels, dialog semantics, contrast, image alternatives.
14. **Browser journey tests and final verification** - Playwright harness,
    journey/persistence/deep-link/package-accounting checks, lint, typecheck,
    build, final visual comparison.

## Data model

Seeded content is immutable TypeScript modules under `src/data/`; only
user-generated demo state is persisted. Shapes below are locked for features 3-10.

### Coach

- `id` (string, stable) - route key for `/coaches/[id]`
- `name` (string), `cityId` (-> City), `specialtyIds` (-> Specialty[])
- `gender` (`'male' | 'female'`) - public, filterable, never gates access
- `yearsExperience` (number), `bio` (string), `portrait` (image ref)
- `certificateIds` (-> Certificate[])
- `trainingLocations` (`{ id, kind: 'coach-pool' | 'student-pool', label }[]`)
- `sessionDurationMinutes` (number), `sessionPriceToman` (integer)
- `rating` (number) and `reviewCount` (number) - seeded display values
- `verified` (boolean) - seeded badge only, no verification flow
- `availabilityPattern` (-> AvailabilityPattern), `accent`
  (`'aqua' | 'sky' | 'mint' | 'sand'`)
- relationships: has many Package, Review, Booking

Eight coaches with Persian names across Tehran, Karaj, Isfahan, Shiraz, Mashhad;
prices 600,000-1,000,000 Toman; deliberately varied credentials and histories.

### Package

- `id`, `coachId`, `sessionCount` (`1 | 5 | 10`)
- `totalPriceToman` (integer), `perSessionToman` (integer)
- every coach offers exactly three packages

### PackagePurchase (persisted)

- `id`, `coachId`, `packageId`, `includedSessions` (integer), `createdAt`
- the first session is booked as part of the purchase; later sessions are booked
  individually and linked to the same purchase

### Booking (persisted)

- `id`, `coachId`, `packageId`, `packagePurchaseId` (exactly one)
- `location` (`'coach-pool' | 'student-pool'`)
- `attendee` (`{ type: 'self' | 'child', childName?, childAgeGroup? }`) - child
  details live only here and in the draft, never in a URL
- `date` (ISO string), `time` (`'HH:mm'`), `durationMinutes` (number)
- `priceToman` (integer), `status` (`'confirmed' | 'completed'`)
- `createdAt`
- no stored balance: `remaining = purchase.includedSessions - bookings with
  status confirmed|completed linked to that purchase`; drafts and unconfirmed
  records never consume a session and no session is counted twice

### Review

- `id`, `coachId`, `bookingId` (local reviews only), `authorName`
- `rating` (1-5, integer), `text` (optional string), `createdAt`
- seeded reviews have no `bookingId`; local reviews are one per completed booking
  and final
- relationships: one Review per Booking; many per Coach

### Favorite

- persisted set of coach ids for the demo student

### AvailabilityPattern

- `coachId`, `weekly` (`{ weekday, startTime, endTime }[]`, Saturday-first),
  `sessionDurationMinutes`
- dated slots are derived for eight weeks; never persisted

### Slot (derived, never stored)

- `coachId`, `date` (ISO), `time` (`'HH:mm'`)
- unavailable when past, outside the pattern, or booked in this browser

### Support models

- **Specialty** - `id`, `label` (e.g. آموزش شنا از صفر, شنای کودکان)
- **City** - `id`, `label` (تهران, کرج, اصفهان, شیراز, مشهد)
- **Certificate** - `id`, `label`, optional issuer/year
- **Testimonial** - `id`, `authorName`, `text`; seeded marketing content,
  separate from coach reviews
- **DemoStudent** - fixed profile shown on the dashboard

### Storage

- `localStorage`: confirmed bookings, package purchase records, favorites,
  local reviews, version marker. Namespaced and versioned; a version mismatch
  resets only Shena's own keys.
- `sessionStorage`: the in-progress booking draft only.
- Never read during server rendering; browser state is read after hydration.

## Tech stack

- **Next.js 16 App Router** - routes, server components by default, root layout
  owns `<html lang="fa" dir="rtl">`, header, footer.
- **React 19** - focused Client Components for filters, calendar, forms, dialogs,
  dashboard lists.
- **TypeScript (strict)** - domain models and repository boundaries.
- **Tailwind CSS v4** - CSS-first tokens in `globals.css`.
- **Nova (`base-nova` on Base UI)** - shadcn-style primitives, restyled as Shena.
- **lucide-react** - direction-aware icons.
- **Vazirmatn (self-hosted)** - typography; no font CDN.
- **next/image** - curated remote swimming photography with configured remote
  patterns and a local fallback.
- **framer-motion** (to add) - purposeful motion.
- **react-hook-form + zod** (to add) - booking and review forms plus validation.
- **@playwright/test** (to add) - browser journey tests.
- **npm** with committed `package-lock.json`.
- Layering: `src/components/{layout,coaches,booking,dashboard,ui}`, `src/data`,
  `src/lib/{storage,repositories,validation,format}`, `src/types`; business logic
  lives in repositories, storage helpers, and formatters.

## Monetization

Not in v1. The demo simulates payment only, with no gateway, commission, payout,
or subscription logic.

## UI/UX

Premium, calm, credible, unmistakably aquatic. Composition follows the Fitlite
reference (light surfaces, thin borders, minimal shadow, colorblock card accents,
oversized display headings, pill CTAs), never its branding.

- `/` - hero, city/specialty search, featured coaches, specialties, how it works,
  trust indicators, testimonials, closing CTA.
- `/coaches` - search, filters (city, price, gender, specialty, level, age
  group), sorting (recommended/rating/price), chips, result count, URL-query
  state, responsive grid, empty state.
- `/coaches/[id]` - coach detail, certificates, locations, three packages,
  seeded reviews, favorite toggle, copy-link, booking CTA.
- `/booking/[coachId]` - package, attendee, location, Jalali day/week/month
  calendar, slots, summary, validation, URL + draft state.
- `/booking/confirmation?booking=<id>` - summary, clearly labeled demo payment,
  success/cancel, not-found state for unknown local ids.
- `/dashboard`, `/dashboard?booking=<id>` - demo profile, upcoming/past bookings,
  remaining sessions, favorites, reviews, scoped reset.

Direction: navy `#102C46`, blue `#176B87`, aqua `#42BFC0`, soft water `#EAF6F8`
on `#F8FBFC`; one accent per card; no gradients, glassmorphism, or neon. Moderate
radii (16px cards, 12px inputs, pill buttons). Persian digits in the interface,
Latin values in storage. RTL from the start with logical CSS properties, a
Saturday-first Jalali calendar, and mirrored navigation. Breakpoints: 360-430px,
768px, 1280px+. Motion is subtle, never meaning-bearing, and respects
`prefers-reduced-motion`. Accessibility: semantic HTML, labeled inputs, visible
focus, keyboard dialogs, contrast, text errors, no horizontal overflow.

## Deployment

> TODO - no target chosen. The plan scopes a local demo (`npm run dev`,
> `npm run build`, `npm run start`); hosted deployment is an explicit non-goal.
> External requests are limited to image assets.

## Open questions

- **Rating source of truth.** Coaches carry seeded `rating`/`reviewCount` and the
  plan says the average is computed from seeded plus local reviews. Decide
  whether the displayed average/count comes from review records alone or from
  seeded aggregates plus local reviews; they can disagree.
- **Age-group vocabulary** for the directory filter and the child attendee is not
  enumerated in either plan.
- **Storage keys.** Namespacing and version marker are required, but the exact
  key strings are unspecified.
- **Coach preview overlay.** The plan describes a directory sheet/sidebar
  conditionally; confirm whether item 4 builds one (`?coach=<id>`) or only the
  full profile page is the path.
- **Purchase creation point.** The plan ties the first session to the purchase
  record; confirm that a package purchase record is only created when that first
  booking is confirmed, so unconfirmed flows consume nothing.
- **Unused asset risk.** External swimming photography is asset-only; a broken
  host must degrade to the local fallback without blocking build or layout.
