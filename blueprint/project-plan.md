# Project Plan

> **Source of truth:** Mission 001, Shena swimming coach marketplace demo, plus
> the discovery decisions confirmed on 2026-11-18. This is a frontend product
> demo: no backend, database, authentication, or real payment. The visual
> reference is Fitlite by Neoteric, stored and analyzed in
> [`reference/README.md`](reference/README.md).

## 1. Problem - What problem are we solving?

Persian-speaking people in Iran who want to learn or improve swimming have no
central way to find and compare qualified coaches. Discovery happens through
Instagram, personal referrals, pool staff, and scattered advertisements. To judge
even a few options, a student has to contact each coach separately and compare
experience, certificates, prices, locations, and availability by hand. Nothing
lets them search by the criteria that decide the choice (city, specialty, level,
age group, gender, price), and nothing lets them book without a back-and-forth
conversation.

Shena centralizes discovery, comparison, and booking in one Persian, RTL
interface, and demonstrates that journey end to end.

## 2. Users - Who is this for?

- **Beginners** learning to swim for the first time.
- **Parents** arranging lessons for their children.
- **Adults improving technique** who want stroke, breathing, or endurance work.
- **Competitive swimmers** preparing for competition.
- **Women** looking for a suitable female instructor or a private setting.
- **Anyone seeking private lessons** who wants to compare options first.

The demo's acting user is the student. Coaches, admins, and support staff are not
actors in this build.

## 3. Product definition and journey

- **Name:** Shena (شنا).
- **Type:** swimming coach discovery and lesson booking marketplace.
- **Promise:** compare real coach credentials, prices, and availability, then
  book a lesson in minutes.

The main journey, working end to end with local persistence:

1. Visit the homepage.
2. Search by city and specialty.
3. Browse and filter coaches.
4. Open a coach profile and compare credentials, certificates, prices, and reviews.
5. Choose a package and a training location.
6. Pick a date and time on the availability calendar.
7. Review the booking summary.
8. Complete a clearly simulated demo confirmation.
9. See the confirmed booking.
10. Manage it from the student dashboard.

## 4. Pages and features

Six routes. All six must feel like one product, share the same Next.js root
layout and header/footer chrome, and use realistic Persian copy.

### 4.1 Homepage (`/`)

Sections: header and navigation; hero with swimming imagery and a clear primary
call to action; search for city and specialty; featured coaches; popular
specialties; how it works; why choose Shena; trust indicators; testimonials;
closing call to action; footer.

- Search submits to `/coaches` with the chosen city and specialty applied.
- Featured coach cards link to their profiles.
- Testimonials are seeded content, separate from coach reviews.
- Copy is concise and natural Persian, not marketing filler.

### 4.2 Coach discovery (`/coaches`)

- Free-text search by coach name or specialty.
- Filters: city, price range, coach gender, specialty, skill level, age group.
- Sorting: recommended, rating, price ascending, price descending.
- Active filter chips, clear-all, live result count, empty state with reset.
- Filter state is readable from the URL query, so homepage search and shared
  links land on the same view.
- If a coach preview opens as a sheet or sidebar over the listing, the open
  coach is encoded in the URL and the canonical profile page is the share
  target. Important information is never trapped in an unaddressable overlay.
- Responsive listing: grid on desktop, single column on mobile, filter sheet on
  small screens.
- Every control is functional against the seeded data.

Coach cards show portrait, name, city, specialties, years of experience, rating
with review count, session price, verification badge, favorite toggle, and a link
to the profile.

### 4.3 Coach profile (`/coaches/[id]`)

- Portrait, name, city, rating, review count, verification status, years of
  experience, biography.
- Specialties, certificates, training locations, session duration, session price.
- Three packages: single session, 5 sessions, 10 sessions, each with total price
  and per-session value.
- Training location choice: the coach's pool or the student's pool. The choice
  is carried into booking.
- Reviews list with rating, author, date, and text.
- Favorite toggle and a booking call to action.
- Canonical, shareable URL with a copy-link action. Any sheet or sidebar that
  shows the profile is deep-linked, and the profile page remains the share
  target.
- Coach gender is visible. It never gates visibility or booking.

### 4.4 Booking and availability (`/booking/[coachId]`)

- Selected coach summary, package, training location, calendar, time slots,
  summary, and total price.
- Attendee step: the lesson is for the student, or for a child. The URL carries
  only the attendee type (`self` or `child`). A child's name and age group are
  entered into the booking form and kept in the `sessionStorage` draft; after
  confirmation they exist only in the local booking record. They are never placed
  in a URL or a share link.
- Calendar with day, week, and month views, all functional, all Jalali:
  - Day: a date strip plus that day's slots.
  - Week: seven columns with slot counts per day.
  - Month: a Jalali month grid with availability indicators, navigable across
    seeded months.
- Past dates cannot be selected. Unavailable slots are visibly distinct and not
  selectable. Slots already booked in this browser are shown as taken.
- Validation covers coach, package, location, attendee data, date, and time, with
  clear Persian messages. Zod schemas back the validation; React Hook Form is
  used where the form complexity justifies it.
- The in-progress booking is held in `sessionStorage`, so reloading or moving
  between pages in the tab keeps the selection.
- The current selection is also encoded in the URL (package, location, attendee
  type, Jalali date, time), so a copied link reopens the same draft. Child
  details are excluded. Precedence is URL parameters, then the tab draft, then
  defaults; changes update the URL without adding history entries.
- A copy-link action shares the current booking selection.
- The primary action continues to the confirmation step.

### 4.5 Booking confirmation (`/booking/confirmation`)

- Summary of booking ID, coach, package, training location, attendee, Jalali
  date and time, session count, duration, price, and status.
- A clearly labeled demo payment step. No card fields, CVV, passwords, or
  sensitive data are requested or stored. The interface states that no real
  payment happens.
- Only an explicit success action marks the booking as confirmed and writes it to
  `localStorage`. Cancelling returns to the booking page without creating a
  booking.
- Success state with the confirmed booking, a link to the dashboard, and a link
  back to the homepage.
- Confirmation is addressable as `/booking/confirmation?booking=<id>`. Because
  bookings are local, an id that does not exist in this browser shows a clear
  not-found state instead of a broken page. Child details appear on the receipt
  for its owner but never in its URL.
- A confirmed booking blocks that slot for this browser on later visits.

### 4.6 Student dashboard (`/dashboard`)

- Fixed demo student profile, no sign-in or auth gate.
- Upcoming bookings and past bookings with full details.
- Favorite coaches.
- Remaining sessions per package, derived from the linked package purchase and
  its confirmed or completed bookings.
- Booking detail view, addressable as `/dashboard?booking=<id>`. An unknown id
  falls back to the booking list with a short notice.
- Empty states that point to coach discovery.
- Demo reset action that clears only Shena's own storage keys, after a
  confirmation step.
- Reviews: a completed booking without a review offers a review form. One review
  per booking, 1 to 5 stars, optional text. Submitted reviews are shown on the
  coach profile next to seeded reviews and affect the displayed average.

### 4.7 Shared surfaces

- Header with logo, primary navigation, search entry, and dashboard access.
- Mobile navigation that works in RTL.
- Footer with product, city, and specialty links that resolve to real pages.
- No dead links and no decorative controls.

## 5. Data and persistence

### 5.1 Seeded data (source of truth for content)

Typed TypeScript modules under `src/data/`: coaches, specialties, cities,
certificates, reviews, packages, availability patterns, testimonials, and the
demo student. Seeded content is immutable; only user-generated demo state is
persisted.

Eight coach profiles, all with stable IDs, portraits, biographies, certificates,
verification status, training locations, session duration, rating, packages,
availability, and reviews:

| Name | City | Specialty | Experience | Session price (Toman) |
|---|---|---|---:|---:|
| علی رضایی | تهران | آموزش شنا از صفر | 8 | 650,000 |
| سارا محمدی | تهران | شنای کودکان | 6 | 700,000 |
| امیرحسین کریمی | کرج | اصلاح تکنیک شنا | 10 | 850,000 |
| نازنین احمدی | اصفهان | شنای بانوان | 7 | 750,000 |
| مهدی جعفری | تهران | آمادگی مسابقات | 12 | 1,000,000 |
| الهام موسوی | شیراز | آموزش شنا از صفر | 5 | 600,000 |
| رضا حیدری | مشهد | شنای کرال | 9 | 800,000 |
| نگار کاظمی | تهران | شنای کودکان | 4 | 650,000 |

Profiles are deliberately varied: different specializations, cities, ages,
credentials, review histories, availability patterns, and personalities. No two
read as the same template with the name changed.

### 5.2 Packages

Every coach offers three packages: single session, 5 sessions, and 10 sessions.
Prices are seeded per coach, roughly the session price times the session count
with a small package discount, rounded to a clean figure. The Mission's
illustrative values for a 700,000 Toman coach are the reference example:

| Package | Sessions | Total (Toman) | Per session |
|---|---:|---:|---:|
| جلسه تکی | 1 | 700,000 | 700,000 |
| پکیج ۵ جلسه‌ای | 5 | 3,250,000 | 650,000 |
| پکیج ۱۰ جلسه‌ای | 10 | 6,000,000 | 600,000 |

Package selection changes the summary and total. Purchasing a package creates a
local package purchase record with its included session count, and the first
session is booked as part of that purchase. Each later session is booked
individually and linked to the same purchase record.

The remaining balance is always derived, never stored as a separate value:

`remaining = included sessions - confirmed or completed bookings linked to that package purchase`

- Cancelled or unconfirmed bookings never consume a session.
- An in-progress draft never consumes a session.
- A session is never counted twice: each confirmed or completed booking links to
  exactly one package purchase.

### 5.3 Availability

Each coach has a weekly pattern (days, time ranges, session duration). Dated
slots are generated for eight weeks, enough to navigate a Jalali month view. A
slot is unavailable when it is in the past, outside the coach's pattern, or
already booked in this browser.

This is local demo state. It is not a reservation system, and the interface must
not imply production-level locking or multi-user concurrency.

### 5.4 Client state

- `localStorage`: confirmed bookings, package purchase records, favorites, the
  demo student's reviews, and a storage version marker. Survives reloads and
  browser restarts.
- `sessionStorage`: the in-progress booking draft only.
- React state: search input, filters, selected date and slot, dialog visibility,
  and other transient UI.
- Keys are namespaced and versioned. On a version mismatch the demo resets its
  own keys only, never unrelated storage.
- No storage access during server rendering. Browser-only state is read after
  hydration to avoid mismatches.

### 5.5 Booking model

A confirmed booking records: booking ID, coach ID, package ID, the package
purchase ID that funds it, training location, attendee type
(`self` or `child`) with the child's name and age group kept in the local record,
date, time, session duration, price, status (`confirmed` or `completed`), and
created timestamp. The demo creates no cancelled booking; any record that is
neither confirmed nor completed is ignored by the balance.

Remaining sessions are never stored on a booking. They are derived from the
linked package purchase as described in 5.2. Cancelled or unconfirmed bookings
do not consume a session, and the booking draft is never counted.

### 5.6 Demo history

On first run the demo seeds two completed bookings (one already reviewed, one
left unreviewed so the review flow is testable immediately), one upcoming
booking, and a part-used package, so the dashboard is not empty. The part-used
package is represented by its purchase record plus the completed bookings linked
to it, never by a stored balance. A clearly labeled demo-only action marks an
upcoming booking as completed, so a visitor can book, complete, and review any
coach in one session.

## 6. Tech stack and architecture

### 6.1 Existing stack

Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 (CSS-first
tokens), shadcn/ui style `base-nova` on Base UI, `lucide-react`, npm with a
committed lockfile.

### 6.2 Dependencies to add

Only what Mission 001 requires: `framer-motion` for purposeful motion,
`react-hook-form` for the booking form, `zod` for input validation, and
`@playwright/test` as a dev dependency for browser journey tests. No global
state library, database client, auth library, or payment SDK.

### 6.3 Routes and structure

```text
src/app/                    page.tsx, coaches, coaches/[id], booking/[coachId],
                            booking/confirmation, dashboard, layout.tsx
src/components/ui/          Nova primitives, restyled as Shena
src/components/layout/      header, footer, mobile navigation
src/components/coaches/     cards, filters, profile sections
src/components/booking/     package picker, calendar, slot picker, summary
src/components/dashboard/   booking cards, favorites, package balance display
src/data/                   seeded coaches, specialties, cities, reviews, slots
src/lib/storage/            safe, versioned local and session storage
src/lib/repositories/       coach, booking, favorite, review access
src/lib/validation/         Zod schemas for booking and review input
src/lib/format/             Toman, Persian digits, Jalali dates, durations
src/types/                  domain models
```

Server Components stay the default. Interactive surfaces (filters, calendar,
booking form, dialogs, dashboard lists) are focused Client Components. Business
logic lives in repositories, storage helpers, and formatters, not inside
presentational components.

The global frame is the standard Next.js App Router root layout at
`src/app/layout.tsx`, which owns the document shell (`<html lang="fa"
dir="rtl">`), the Vazirmatn font, and the header and footer. There is no custom
app-shell wrapper or provider layer. Nested layouts are used only where a route
section genuinely needs different chrome.

### 6.4 Validation and testing

Zod covers booking selections, child details, and review input. React Hook Form
handles the booking form. Playwright covers the main journey plus persistence and
responsive checks. The repository has no test runner today; the browser harness
and its commands are added during the testing item and documented in
`AGENTS.md` through the Blueprint `/tests browser` setup.

### 6.5 Deep links and shareable state

Any surface that carries important information must be reachable by URL.

- Canonical content routes: `/coaches/[id]`, `/booking/[coachId]`,
  `/booking/confirmation?booking=<id>`, and `/dashboard?booking=<id>`.
- Overlay state: if a modal, sheet, or sidebar shows important content over
  another page, the open state is encoded in the URL, so the link reopens it, a
  reload restores it, and back/forward closes or opens it. A coach preview over
  the directory uses `?coach=<id>` alongside the canonical profile page.
- Booking selections live in the URL as well as the tab draft, with precedence
  URL, then `sessionStorage`, then defaults. Selection changes use
  `router.replace`, so the address stays current without filling history.
- Privacy: booking URLs carry the attendee type only. Child names and age groups
  never appear in a URL, a share link, or a receipt link; after confirmation they
  live only in the local booking record. A shared child-type link reopens with
  that type selected and asks for the details again, because they were never in
  the URL.
- Share controls copy the canonical URL. They appear on the coach profile and the
  booking summary.
- Local-only limits: confirmation and dashboard links resolve only in the
  browser that owns the booking. Those screens show a clear not-found state
  instead of failing, and never imply that local demo data is shared across
  browsers or devices.
- No important content is modal-only. Every deep-linked overlay has a full-page
  fallback. Query parameters are preferred over intercepting routes for this
  demo because they are simpler to build and to test.

## 7. Design system and visual direction

### 7.1 Reference analysis

Fitlite contributes composition, not branding: light surfaces, thin borders,
minimal shadow, a two-column desktop layout with a profile sidebar, date-grouped
cards, one saturated color block per card, oversized display headings against
small labels, pill CTAs and tags, and focused centered booking and success
dialogs. The full analysis and file index live in
[`reference/README.md`](reference/README.md).

### 7.2 Shena identity

Premium, calm, credible, and unmistakably aquatic. The product should read as a
professional swimming service, not a gym, a generic SaaS dashboard, or a
marketplace template.

### 7.3 Color

Mission tokens form the base. The reference supplies the colorblock device, which
is expressed through a small set of water-adjacent tints.

| Token | Value | Use |
|---|---|---|
| Deep navy | `#102C46` | Primary text, strong surfaces, primary actions |
| Primary blue | `#176B87` | Links, active states, emphasis |
| Aqua | `#42BFC0` | Accent, verification and availability highlights |
| Soft water | `#EAF6F8` | Section tint, informational panels |
| Background | `#F8FBFC` | Page background |
| Surface | `#FFFFFF` | Cards, dialogs, header |
| Primary text | `#142B3A` | Body and headings |
| Secondary text | `#667985` | Metadata, helper text |
| Border | `#E2EBEF` | Dividers, card borders |
| Success | `#198754` | Confirmed states |
| Warning | `#D99A32` | Warnings, limited availability |
| Error | `#D9534F` | Validation and errors |

Card accents are limited to aqua, sky, mint, and sand tints with navy text. One
accent per card; accents never become page backgrounds. No neon colors, no
saturated full-bleed blue sections, no decorative gradients, no glassmorphism.

### 7.4 Typography

Vazirmatn throughout, self-hosted so the build and demo do not depend on a font
CDN. Weight, size, and spacing carry the display hierarchy that the reference
achieves with a condensed Latin face. Body copy uses a Persian-friendly line
height and never looks cramped. Numbers render as Persian digits in the
interface; identifiers and stored values stay Latin.

### 7.5 Shape, spacing, and elevation

Moderate radii (about 16px for cards, 12px for inputs, full pill for primary
buttons and tags). A consistent spacing scale, generous whitespace, thin borders,
and restrained shadows. No rounded-everything treatment.

### 7.6 Imagery

Real swimming photography only: pools, instructors, lessons, water, children
learning, training environments. No gym, bodybuilding, or cartoon imagery.
Portraits use a consistent aspect ratio with a subtle aqua or navy tint, echoing
the reference without duplicating it. Preferred sources are curated remote
photographs served through `next/image` with configured remote patterns and a
local fallback. These requests are asset-only and carry no user, child, booking,
or favorite data. Assets must never break the layout or block the build.

### 7.7 RTL

Persian RTL is built in from the start, not painted over an LTR layout:
`lang="fa"`, `dir="rtl"`, logical CSS properties (`margin-inline`,
`padding-inline`, `inset-inline`, `border-inline`), start/end alignment,
direction-aware icons, RTL-aware dropdowns and dialogs, a Jalali calendar ordered
from Saturday, and mirrored breadcrumbs and pagination.

### 7.8 Motion

Framer Motion for dialog transitions, card hover and press feedback, list and
filter updates, page transitions where they add clarity, and success feedback.
Motion stays subtle, is never required to understand state, and respects
`prefers-reduced-motion`.

## 8. Responsive and accessibility

Breakpoints: mobile 360px to 430px, tablet 768px, desktop 1280px and above.
Mobile layouts are intentional, not shrunk desktop ones: bottom or drawer
navigation, a filter sheet, a calendar that fits without horizontal scrolling,
stacked summary panels, and comfortable touch targets.

Accessibility: semantic HTML, labeled inputs, visible focus, keyboard-operable
dialogs, adequate contrast, descriptive image alternatives, and reduced-motion
support. Errors are announced in text, not color alone. No horizontal overflow at
any supported width.

## 9. Demo constraints and privacy

- No real authentication, accounts, sessions, or permissions. The dashboard is
  open.
- No backend, API layer, database, or server availability.
- One browser's local state only. No concurrency, no cross-device sync, no
  production booking protection.
- Simulated payment only. No card data, no gateway, no claim that money moved.
- Coach gender is public and optionally filterable. No visitor is restricted or
  hidden by their own gender.
- Student gender and preferences are never displayed publicly.
- No user data leaves the machine. No analytics, tracking, advertising, or
  unnecessary third-party scripts, and no booking, favorite, child, or profile
  data is transmitted anywhere.
- Curated swimming photography may be loaded from external image hosts purely to
  render image assets. That is an asset request, not a data transmission: no demo
  state or identifier is attached to it.

## 10. Non-goals

Real authentication, OTP or SMS, database, Prisma, backend, payment gateway, card
collection, notifications, coach dashboard, admin dashboard, payouts, commission
accounting, disputes, production booking locks, multi-user concurrency,
real-time sync, mobile apps, chat, wallet, coupons, subscriptions, referrals, AI
recommendations, multi-language support, SEO strategy, and hosted deployment.

## 11. Definition of done

1. All six pages are implemented and feel like one product.
2. The interface is Persian, genuinely RTL, Jalali-dated, Toman-priced, and uses
   Persian digits.
3. The design follows the Fitlite direction while reading unmistakably as a
   swimming marketplace.
4. Discovery, search, filters, and sorting work against seeded data.
5. Profiles show complete coach information; packages and training locations
   affect the booking.
6. Favorites persist; the calendar works in day, week, and month views; booking
   validation works.
7. Confirmation is clearly simulated; bookings persist; booked slots become
   unavailable in this browser.
8. The dashboard reflects real local state, including remaining package sessions
   and reviews.
9. Responsive behavior holds at 360px to 430px, 768px, and 1280px and above, with
   no overflow.
10. No real auth, backend, database, or payment exists; type checking, lint, and
    build pass; Playwright journeys pass.
11. Important information is shareable: coach profiles, booking selections,
    receipts, and booking details open from a copied URL, overlays expose their
    state in the URL, and every overlay has a full-page fallback. No child name
    or age group ever appears in a URL.
12. No user, child, booking, or favorite data leaves the browser. External
    requests are limited to curated image assets, with no analytics, tracking, or
    advertising.

## 12. Applied defaults

| Area | Default |
|---|---|
| Dates | Jalali display, Persian month and weekday names, ISO storage |
| Money | Integer Toman, Persian digits on display |
| Availability | Eight weeks of dated slots generated from weekly patterns |
| Calendar | Day, week, and month views, Saturday-first week |
| Packages | Three per coach; purchase record holds included sessions; first session at purchase; balance derived |
| Reviews | One per completed booking, 1 to 5 stars, optional text, final |
| Rating display | Average computed from seeded plus local reviews |
| Seeded history | Two completed bookings (one reviewed, one not), one upcoming, one part-used package |
| Attendee | Self or child; URL carries the type only; child name and age group stay in the draft and the local record |
| Training location | Coach's pool or student's pool; no price or slot difference |
| Filters | URL-query backed; sorting by recommended, rating, or price |
| Shareable state | URL carries filters, overlay ids, and non-sensitive booking selections; no child details; canonical pages for content |
| Layout | Mobile-first, intentional mobile compositions |
| Typography | Self-hosted Vazirmatn, weight-driven hierarchy |
| Imagery | Curated swimming photography with graceful fallback; image asset requests only |
| External requests | No user data, analytics, tracking, or advertising; image assets are the only external requests |
| Demo reset | Clears only Shena's namespaced keys, after confirmation |
| Verification badge | Seeded status only; no document verification flow |

## 13. Assumptions and risks

- Assumption: a rich, coherent demo of one journey matters more than breadth; the
  eight coaches are written with care rather than expanded into a larger list.
- Assumption: remote swimming photography is acceptable for a demo, with a local
  fallback so the layout never breaks.
- Risk: Jalali date math and RTL calendar layout are the most error-prone parts;
  build and test the date utilities before the calendar UI.
- Risk: the reference's colorblock confidence can drift into noise; the accent
  set stays small and water-adjacent.
- Risk: `localStorage` and `sessionStorage` can cause hydration mismatches if read
  during render; read after mount and keep server output stable.
- Risk: Persian typography can degrade in dense cards and dialogs; review in a
  real browser at all three breakpoints, not only in code.
- Risk: scope pressure to add coach or admin surfaces; Mission 001 excludes them
  and the build plan follows the mission.
