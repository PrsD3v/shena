# Feature: Domain models, seeded data, and repositories

**From build-plan:** feature 3
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/domain-models-seeded-data-repositories`

## Goal

Give the demo one typed source of truth: the domain models every later screen
shares, eight written coach profiles with packages, availability, and reviews,
safe versioned browser storage, repository access modules, the derived
remaining-session rule, and the demo history plus reset behavior. Nothing is
rendered in this feature; items 4 to 10 consume these modules.

## In scope

- Domain types for coaches, cities, specialties, levels, age groups,
  certificates, training locations, packages, availability patterns, reviews,
  testimonials, the demo student, bookings, and package purchases.
- Seeded content under `src/data/`: five cities, seven specialties, three levels,
  three age groups, ten certificates, eight coach profiles, 24 packages, eight
  weekly availability patterns, seeded reviews for every coach, five
  testimonials, and the fixed demo student.
- One local portrait fallback asset so seeded image refs never 404 and later
  photography work can swap per-coach files without changing the data shape.
- `src/lib/storage.ts`: namespaced, versioned, non-throwing helpers for
  `localStorage` and `sessionStorage`, with parse validation and prefix-scoped
  clearing.
- `src/lib/ids.ts`: one ID generator for new bookings, purchases, and reviews.
- `src/lib/demo.ts`: demo history seeding on first run and after a reset, plus
  the reset helper that clears only Shena's keys.
- Repository modules for coaches, bookings, favorites, reviews, and package
  purchases, including typed failure results for invalid input.
- `src/lib/session-balance.ts`: the derived consumed and remaining session rule.

## Out of scope

- Any route, page, layout, component, or screenshot. Items 4 to 10 own the UI.
- Search, filtering, sorting, calendar slot generation, and booking validation
  schemas. Items 4, 6, and 8.
- Creating or confirming a booking through the UI, and the demo "mark completed"
  action. Items 7 and 9, which call these repositories.
- The review form and its star input. Item 10; this feature only stores and reads
  local reviews.
- `next.config.ts` remote image patterns, per-coach photography, and the
  homepage hero assets. Items 4 and 5.
- A test runner. The project still has no `test` command; item 14 adds
  Playwright.
- A React context, provider, or global store. Repositories read browser storage
  directly after hydration.

## Build loop

`workflow.stepReview` is `feature`: one review packet after all steps.
Checkpoint commits are disabled. Work one step at a time and leave the branch
uncommitted for review; `/complete` makes the feature commit. Keep the durable
checkboxes current.

## Build steps

- [x] **Step 1 - types and reference catalogs** - add the domain types plus the
  city, specialty, level, age-group, certificate, testimonial, and demo-student
  modules. *Done when:* every catalog is typed with stable string ids, ids are
  unique within each catalog, and `npx tsc --noEmit` and `npm run lint` pass.
- [x] **Step 2 - coach profiles, packages, and availability** - write the eight
  profiles from the project plan, their three packages each, their weekly
  availability patterns, and the local portrait fallback. *Done when:* eight
  coaches exist with the planned names, cities, specialties, experience, and
  session prices; every coach has exactly three packages with integer per-session
  prices; every city, specialty, certificate, and location reference resolves;
  every availability pattern uses the coach's session duration; `npx tsc
  --noEmit` and `npm run lint` pass.
- [x] **Step 3 - seeded reviews** - write three or four seeded reviews per coach
  with varied authors, ratings, dates, and lengths. *Done when:* every coach has
  at least three reviews, every rating is an integer from 1 to 5, every review
  references a real coach, and `npx tsc --noEmit` and `npm run lint` pass.
- [x] **Step 4 - storage and demo state** - add the versioned storage helpers,
  the ID helper, demo history seeding, the derived demo history factory, and the
  reset helper. *Done when:* a Node check against a fake browser storage shows
  round-trip reads and writes, prefix-scoped clearing on version mismatch and on
  reset, no throw when storage is missing, and a seeded history of one purchase,
  three linked bookings, one local review, and two favorites; `npx tsc --noEmit`
  and `npm run lint` pass.
- [x] **Step 5 - repositories and balance** - add the five repository modules and
  the remaining-session helper. *Done when:* the Node check shows coach lookup,
  package lookup, favorite toggle persistence, purchase creation deriving the
  included session count, booking creation rejecting unknown or mismatched
  references, one-review-per-booking enforcement, merged seeded plus local
  reviews, and a balance that counts only confirmed or completed linked
  bookings; `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass.

## Files / areas

- `src/types/{coach,booking,review}.ts`
- `src/data/{cities,specialties,levels,age-groups,certificates,coaches,packages,availability,reviews,testimonials,demo-student}.ts`
- `src/lib/{storage,ids,demo,session-balance}.ts`
- `src/lib/repositories/{coaches,bookings,favorites,reviews,purchases,guards}.ts`
- `public/images/coach-portrait.png` (generated local fallback, no external
  request)

## Data / contracts

### Identity and location

- Coach ids are lowercase ASCII slugs used directly in `/coaches/[id]`, for
  example `ali-rezaei`.
- Package ids are `pkg-<coachId>-<sessionCount>`.
- New bookings, purchases, and reviews get `<kind>-<uuid>` ids from
  `createId`, where `<kind>` is `booking`, `purchase`, or `review`. Demo history
  uses stable `demo-...` ids so reseeding is idempotent within a version.
- Prices are integer Toman; durations are integer minutes; ratings are integers
  from 1 to 5.
- A booking `date` is an ISO calendar date (`YYYY-MM-DD`), `time` is 24-hour
  `HH:mm` in Tehran local time, and `createdAt` is a full ISO timestamp.
- Weekdays use a Saturday-first index (`0` is Saturday through `6` is Friday),
  because Jalali weeks start on Saturday. The availability pattern stores
  `HH:mm` range boundaries; dated slots are out of scope and are derived later.

### Coach shape

The coach record keeps the locked project fields and adds the two filter
dimensions the directory needs, because neither plan enumerates them on the
coach:

- `levelIds`: subset of `beginner | intermediate | advanced`.
- `ageGroupIds`: subset of `children | teen | adult`.
- `portrait`: `{ src, alt }`. Every seeded coach uses the single local fallback
  path until item 4 or 5 supplies curated photography.
- `availabilityPattern` is not embedded; `getAvailabilityPattern(coachId)` reads
  the separate seeded pattern keyed by coach id.

### Persisted state and storage keys

| Key | Storage | Value |
|---|---|---|
| `shena:version` | local | String storage version, currently `1` |
| `shena:bookings` | local | `Booking[]` |
| `shena:purchases` | local | `PackagePurchase[]` |
| `shena:favorites` | local | `string[]` of coach ids |
| `shena:reviews` | local | Local `Review[]`, each with `bookingId` |
| `shena:booking-draft` | session | Booking draft owned by item 6 |

- Every helper returns `null` or `false` instead of throwing when storage is
  absent, blocked, full, or holds malformed JSON. Reads validate each stored
  record and keep only the valid ones, so one bad record cannot hide the rest.
- Version handling is lazy and idempotent: repositories call
  `ensureDemoState()` before a read or write. When the version is missing or
  differs, every key beginning with `shena:` is removed from both storages, the
  version marker is written, and demo history is seeded. Unrelated origin keys
  are never touched.
- Seeding writes data keys first and the version marker last, so a failed seed
  retries on the next load instead of being recorded as current.
- `resetDemoData()` clears only `shena:` keys, reseeds the same demo history, and
  reports success or unavailability.
- No storage access happens during server rendering; every helper returns
  empty/unavailable when `window` is undefined.

### Demo history

`createDemoHistory(now)` produces one part-used five-session purchase for
`ali-rezaei` plus three bookings linked to it: two completed bookings (the older
one reviewed, the newer one unreviewed) and one upcoming confirmed booking. The
upcoming date is the next occurrence of one of that coach's seeded weekdays at
18:00; the completed bookings are the same weekday seven and fourteen days
earlier. Remaining sessions are therefore 5 - 3 = 2, derived, never stored. Two
favorite coaches are seeded.

### Repository contracts

- Coach access: `listCoaches`, `getCoach`, `listPackagesForCoach`, `getPackage`,
  `getAvailabilityPattern`. Seeded data is returned as copies.
- Purchase access: `listPurchases`, `getPurchase`, and
  `createPurchase({ coachId, packageId })`, which derives `includedSessions` from
  the package's `sessionCount` and fails with a typed reason when either
  reference is unknown.
- Booking access: `listBookings`, `getBooking`, and `createBooking(input)`, which
  validates that the coach, package, and purchase exist, that the purchase
  matches the coach and package, that the coach has no booking at the same date
  and time, and that the purchase still has a session available. It fails with a
  typed reason instead of writing invalid state. New records are written with
  status `confirmed`.
- Favorite access: `listFavoriteCoachIds`, `isFavorite`, and `toggleFavorite`,
  returning the new favorite state plus whether the write persisted.
- Review access: `listLocalReviews`, `getReviewForBooking`,
  `createReview({ bookingId, coachId, authorName, rating, text? })`, and
  `listReviewsForCoach(coachId)`, which merges seeded and local reviews newest
  first. A second review for the same booking fails with a typed reason.
- Rating summary: the displayed seeded aggregate is the source of the seeded
  portion. Local reviews adjust it as
  `(coach.rating * coach.reviewCount + sum(local ratings)) /
  (coach.reviewCount + local count)`, and the displayed count is
  `coach.reviewCount + local count`. Seeded review records are a visible sample
  and do not recompute the aggregate. The helper is `getRatingSummary`.
- Balance: `countSessionsUsed(purchaseId, bookings)` counts only bookings whose
  `packagePurchaseId` matches and whose status is `confirmed` or `completed`;
  `remainingSessions(purchase, bookings)` is `includedSessions - used`, clamped at
  zero. Nothing stores a balance.

### Privacy

Child name and age group exist only in the booking attendee record and in the
session draft. Repositories never log them, never place them in ids, and no URL
helper is added here.

## Testing

No test runner is configured and `AGENTS.md` declares no `test` or `Verify`
command, so there is no test gate. Evidence:

- `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- A Node 24 check kept out of the repository: it runs the TypeScript modules
  directly with a fake `localStorage`/`sessionStorage`, asserts the seeded data,
  storage versioning, reset scope, repository results, and balance math, and is
  run with `node --test`.
- No browser evidence is possible in this feature because no UI consumes the
  modules yet; the first browser evidence arrives with item 4.

## Notes for the AI

- Import types with `import type` and data/helpers through the `@/*` alias.
- Use `satisfies` on seeded arrays; the Node check validates every cross
  reference.
- Keep seeded content immutable; return copies from repositories so callers
  cannot mutate the source arrays.
- Do not add validation schemas, UI, routes, providers, or dependency installs.
- Follow `coding-standards.md`: no `any`, no em dashes, Persian copy with Latin
  storage values, functions under 50 lines where practical.
- Persian text is content; ids, keys, and stored values stay Latin.

## Open questions

None blocking. Four reversible pre-decisions are recorded rather than asked:

1. Level vocabulary is `beginner`, `intermediate`, `advanced` and age-group
   vocabulary is `children`, `teen`, `adult`, with Persian labels in `src/data/`.
   The plans require both filters but never enumerate the values.
2. `levelIds` and `ageGroupIds` are explicit coach fields, because deriving them
   from specialties would hide the mapping.
3. The seeded rating aggregate is weighted with local reviews rather than
   recomputed from the visible seeded review sample, which matches the plan's
   "seeded display values" and "seeded plus local reviews".
4. Portraits point at one local fallback image until curated photography work
   lands, so the seed data renders without a remote host.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":12952,"specSha256":"74682797d37104fe6bde00f31cd6b2a9f096c5c759b272a2d7b628caddc7ea2b","branch":"refs/heads/feature/domain-models-seeded-data-repositories","head":"b4c3900d7777854e7373484f50a198466c848057","baseRef":"refs/heads/main","baseCommit":"87c0ff3cdc4d60b10721ec5cfd36f67678360000","sourceTree":"09dc4b44900418257f2f5ca22841e7115ee87248","landing":"local-merge","absentOptional":[]} -->

## Independent review

**Status:** passed
**Target commit:** b4c3900d7777854e7373484f50a198466c848057
**Base commit:** 87c0ff3cdc4d60b10721ec5cfd36f67678360000
**Base ref:** refs/heads/main
**Spec hash:** 74682797d37104fe6bde00f31cd6b2a9f096c5c759b272a2d7b628caddc7ea2b
**Prepared by:** claude
**Builder model:** unknown (runtime did not expose exact model)
**Requested reviewer:** claude
**Requested model:** runtime default (exact model not known until reviewer starts)
**Requested execution:** automatic
**Requested at:** 2026-11-18T23:57:07Z
**Workflow:** regular
**Check required:** no
**Reviewer adapter:** claude
**Reviewer model:** deepseek-flash
**Reviewer context:** fresh subagent
**Actual execution:** automatic
**Reviewed at:** 2026-11-19T00:02:26Z
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** passed
**Check result:** not-required

### Commands

- `git rev-parse HEAD`: pass, b4c3900d7777854e7373484f50a198466c848057
- `git merge-base refs/heads/main b4c3900d7777854e7373484f50a198466c848057`: pass, 87c0ff3cdc4d60b10721ec5cfd36f67678360000
- `sha256sum blueprint/context/current-feature.md`: pass, 74682797d37104fe6bde00f31cd6b2a9f096c5c759b272a2d7b628caddc7ea2b
- `git status --porcelain=v1`: pass, only ` M blueprint/context/review.md` before this pass wrote the ledger
- `npx tsc --noEmit`: pass
- `npm run lint`: pass
- `npm run build`: unavailable, EROFS on `.next` in the reviewer sandbox
- `node --experimental-webstorage --localstorage-file="$TMPDIR/probe/ls.db" --import "$TMPDIR/probe/alias-loader.mjs" --test --test-concurrency=1 "$TMPDIR/probe/data.test.ts" "$TMPDIR/probe/reviews.test.ts" "$TMPDIR/probe/demo.test.ts" "$TMPDIR/probe/repositories.test.ts"`: unavailable, `$TMPDIR/probe` does not exist

### Evidence

- Delta `87c0ff3..b4c3900` is one commit, `feat: add domain models, seeded data, and repositories`: 26 files, +1918/-6, read in full for `src/types/*`, `src/data/*`, `src/lib/{storage,ids,demo,session-balance}.ts`, `src/lib/repositories/*` and the new `public/images/coach-portrait.png` (PNG 320x400, local path only, no remote host added to `next.config.ts`).
- Seed cross-references checked by hand against `src/data`: 5 cities, 7 specialties, 3 levels, 3 age groups, 10 certificates, 8 coaches with 24 packages, 8 availability patterns whose `sessionDurationMinutes` matches each coach, 27 seeded reviews (at least three per coach, integer ratings 1-5, no `bookingId`), 5 testimonials, one demo student. Every `cityId`, `specialtyId`, `certificateId` and location reference resolves.
- Coach names, cities, experience and session prices match `blueprint/project-plan.md:192-199`; every package per-session price is an integer and matches its coach's `sessionPriceToman` for the single-session package.
- Storage and privacy: `window.localStorage` and `window.sessionStorage` are touched only in `src/lib/storage.ts:20`, behind a `typeof window` guard and try/catch, with a parse guard per record; `clearShenaStorage` collects keys before removing them and only clears the `shena:` prefix; no `console.*` call exists in `src/`; child name and age stay in the attendee record and are absent from ids and URLs.
- Balance rule: `src/lib/session-balance.ts` counts only `confirmed` or `completed` bookings linked to the purchase and clamps at zero; the seeded history is one five-session purchase with three linked bookings, so remaining is 2 with nothing stored.
- Standards sweep over the delta: no `any`, no em dash, en dash or ellipsis characters, no commented-out code, no skipped or focused tests, no test files, no direct storage access outside the helper.
- Reviewer identity: the project's installed adapter is `claude` (`blueprint/.state/manifest.json`) and the runtime's session metadata plus `default_model` expose `deepseek-flash` with no subagent model override configured.

### Findings

- F-01 [P2] open, `createBooking` persists location and attendee without validating them
- F-02 [P2] open, demo upcoming session time is not the spec's 18:00 on the coach's Thursday window
- F-03 [P3] open, `perSessionToman` depends on unrounded division staying integer

### Remaining risk

- The logic probe is unavailable: `$TMPDIR/probe` does not exist, so the seeded-data, storage-versioning, reset-scope, repository-result and balance assertions could not be re-run in this pass and rest on the builder's out-of-repo evidence.
- `npm run build` is unavailable in the reviewer sandbox because `.next` is read-only (EROFS), so build success is not re-verified here; a `.next` artifact dated 2026-11-19 03:17 exists in the working directory from outside this session and is not evidence from this pass.
- No test runner is configured and `AGENTS.md` declares no `test` or `Verify` command, so the tests lens has no automated signal by design; no in-repo caller exercises the storage and repository modules until items 4 to 10.
