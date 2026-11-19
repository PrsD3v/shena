# Feature: Global chrome, coach discovery, and coach profile

**From build-plan:** feature 4
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/global-chrome-coach-discovery-and-coach-profile`

## Goal

Give Shena its public frame and its first two real surfaces: a header, footer,
and RTL mobile navigation shared by every page; a coach directory that searches,
filters, sorts, and keeps its state in the URL; and a complete coach profile that
is the canonical, shareable page for a coach. A visitor can compare all eight
seeded coaches and keep favorites, in Persian and RTL, without any route leading
somewhere that does not exist yet.

## Design reference

- [`blueprint/reference/fitlite-mobile-and-desktop-classes.png`](../../blueprint/reference/fitlite-mobile-and-desktop-classes.png)
  - sticky top bar with a compact logo and menu, a horizontal pill filter strip,
    a colorblock card grid, and a small filter control on mobile.
- [`blueprint/reference/fitlite-mobile-coach-profile.png`](../../blueprint/reference/fitlite-mobile-coach-profile.png)
  - centered profile header, breadcrumb, star rating, small metadata row, and
    content cards below a tinted header.
- [`blueprint/reference/fitlite-desktop-classes-sidebar.png`](../../blueprint/reference/fitlite-desktop-classes-sidebar.png)
  - desktop listing with a narrow sidebar, card grid, and pill tags.

Composition and shape only. Shena tokens, colors, radii, and Vazirmatn already
live in `globals.css`; none of the reference branding is reused. The local
placeholder portrait `public/images/coach-portrait.png` is the portrait for all
eight coaches until later photography work replaces it.

## In scope

- Global chrome in the standard root layout: site header, footer, and an RTL
  mobile navigation sheet. Header links to home and the directory; footer links
  to the directory, its cities, and its specialties. The header includes a
  compact search entry that submits to `/coaches?q=`.
- `/coaches`: URL-backed discovery over the eight seeded coaches.
  - Free-text search over coach name and specialty label.
  - Filters for city, price band, coach gender, specialty, level, and age group.
  - Sorting by recommended, rating, and price ascending or descending.
  - Active filter chips, clear-all, a live result count, and an empty state with
    a reset action.
  - Desktop filter sidebar, mobile filter sheet, and a responsive card grid.
  - Coach cards with portrait, name, city, specialties, years of experience,
    rating with review count, session price, verification badge, favorite
    toggle, and a link to the profile.
- Persisted favorites on cards and profiles, through the existing
  `shena:favorites` repository.
- `/coaches/[id]`: the canonical coach page with portrait, name, city,
  verification badge, gender, rating and review count, years of experience,
  biography, specialties, certificates, both training locations, session
  duration, session price, three packages with total and per-session prices, and
  the seeded review list. A favorite toggle and a copy-link action sit on the
  page. An unknown id renders the not-found state.
- `src/app/not-found.tsx` so an unknown coach id (and any future missing route)
  gets a Shena page with a link back to discovery.

## Out of scope

- Homepage content (feature 5). The temporary component gallery at `/` stays.
- The booking call to action on the coach profile and the booking entry point
  (feature 6). No control links to a route that does not exist yet.
- The dashboard link in the header (feature 9).
- A coach preview overlay (`?coach=<id>`). The plan makes it conditional; this
  feature builds the canonical profile page only, which keeps the directory
  simpler and avoids a second representation of the same information.
- Local review submission and merging local reviews into the displayed average
  (feature 10).
- Motion polish (feature 11), responsive refinement beyond the intentional
  layouts here (feature 12), and accessibility refinement beyond the labels,
  focus, and semantics this feature needs (feature 13).
- Remote swimming photography. Item 4 uses the seeded local portrait; imagery
  work stays with the homepage feature.
- Pagination, infinite scroll, or a map. Eight seeded coaches do not need them.
- Any new dependency, state library, or persistence key.

## Build loop

`workflow.stepReview` is `feature`, so the build presents one review packet after
all steps. `workflow.checkpointCommits` is `disabled`, so no checkpoint commits
are created; `/complete` owns the feature commit. Build steps in order and keep
each diff reviewable.

## Build steps

- [x] **Step 1 - Global chrome in the root layout** - add
  `src/components/layout/site-header.tsx`, `site-footer.tsx`, and
  `mobile-nav.tsx`, and compose them into `src/app/layout.tsx` around the page
  content. The header carries the logo, home and directory links, a desktop
  search form posting `q` to `/coaches`, and the mobile sheet trigger. The footer
  carries the directory link plus city and specialty links that target
  `/coaches` with the documented query values. The mobile sheet closes on
  navigation. *Done when:* every existing route renders the header and footer;
  the mobile sheet opens, traps focus, closes with Escape and its close button,
  and its links point at real routes; the chrome has no dashboard link and no
  dead control; `npm run lint` and `npx tsc --noEmit` pass.

- [x] **Step 2 - Discovery state, results, and coach cards** - add the pure
  discovery module `src/lib/coaches/discovery.ts` (parse, normalize, filter,
  sort, build query, chips) and the directory route `src/app/coaches/page.tsx`
  with `src/components/coaches/coach-card.tsx`, `coach-grid.tsx`,
  `coach-results.tsx`, and the page-level client surface. The page reads
  `searchParams` on the server, validates them against the seeded id sets, and
  renders the filtered, sorted result list. The client keeps the same filter
  state, filters locally, and rewrites the address with
  `window.history.replaceState` so no filter change triggers a server round
  trip. Cards link to `/coaches/[id]`. Includes the result count and the empty
  state with reset. *Done when:* `/coaches` shows all eight coaches; `?city=tehran`
  shows four, `?q=کودکان` shows two, `?gender=female` shows four, and
  `?price=over-850` shows one; `?sort=price-asc` orders by session price;
  unknown parameter values are ignored; a combination with no match shows the
  empty state and reset action; every card links to its profile path;
  `npm run lint` and `npx tsc --noEmit` pass.

- [x] **Step 3 - Filter controls, chips, sorting, and favorites** - add
  `src/components/coaches/coach-filters.tsx`, `active-filter-chips.tsx`,
  `sort-select.tsx`, the mobile filter sheet, and the persisted favorites hook
  plus `favorite-button.tsx` used by cards. Search filters live while typing
  and the URL update is debounced; every other control is immediate. Chips
  remove one filter, clear-all resets the filters while keeping the sort, and
  the mobile sheet shows the same controls and the current result count.
  Favorites stay in sync between cards and later the profile, persist through
  reload, and expose `aria-pressed` with a coach-specific label. *Done when:*
  all six filters and the sort control change the URL and the results; chips
  and clear-all do the same; the mobile sheet filters the listing; a favorite
  survives reload and is announced as pressed; storage failure leaves the card
  usable and shows no false saved state; `npm run lint` and `npx tsc --noEmit`
  pass.

- [x] **Step 4 - Coach profile, profile actions, and not-found** - add
  `src/app/coaches/[id]/page.tsx`, the profile section components under
  `src/components/coaches/`, a copy-link client component, the favorite toggle
  on the profile, and `src/app/not-found.tsx`. The page resolves the coach with
  `getCoach`, renders every required detail and the seeded reviews, and calls
  `notFound()` for an unknown id. The copy action copies the canonical profile
  URL and reports success or failure. The profile includes no booking or
  dashboard control. *Done when:* every seeded coach renders at
  `/coaches/<id>` with portrait, name, city, verification, gender, rating and
  count, experience, bio, specialties, certificates with issuer and year,
  both training locations, session duration, session price, three packages with
  total and per-session prices, and the review list with author, Jalali date,
  rating, and text; an unknown id shows the Shena not-found page with a link to
  `/coaches`; toggling the favorite on the profile is reflected on the directory
  and vice versa; copy-link reports success and reports a clipboard failure
  without throwing; `npm run lint`, `npx tsc --noEmit`, and `npm run build`
  pass.

## Files / areas

- `src/app/layout.tsx` (compose chrome), `src/app/coaches/page.tsx`,
  `src/app/coaches/[id]/page.tsx`, `src/app/not-found.tsx`
- `src/components/layout/site-header.tsx`, `site-footer.tsx`, `mobile-nav.tsx`
- `src/components/coaches/coach-card.tsx`, `coach-grid.tsx`,
  `coach-results.tsx`, `coach-directory.tsx`, `coach-filters.tsx`,
  `active-filter-chips.tsx`, `sort-select.tsx`, `favorite-button.tsx`,
  `copy-link-button.tsx`, `profile-sections.tsx`
- `src/lib/coaches/discovery.ts` (pure filtering, sorting, URL, and chip logic)
- `src/hooks/use-favorites.ts` (client store over the favorites repository)
- Existing modules consumed unchanged: `src/data/*`, `src/lib/format.ts`,
  `src/lib/repositories/coaches.ts`, `src/lib/repositories/favorites.ts`, and
  the `src/components/ui/*` primitives.

## Data / contracts

No new persisted key and no change to the seeded data shape. Favorites keep
using `shena:favorites` through `src/lib/repositories/favorites.ts`. Storage is
read only in client components; server rendering never touches it.

The discovery URL is the shareable state contract:

| Parameter | Accepted values | Default |
|---|---|---|
| `q` | free text, trimmed to 60 characters | absent |
| `city` | a `CITIES` id | absent |
| `specialty` | a `SPECIALTIES` id | absent |
| `level` | a `LEVELS` id | absent |
| `age` | an `AGE_GROUPS` id | absent |
| `gender` | `male` or `female` | absent |
| `price` | `under-700`, `700-850`, or `over-850` | absent |
| `sort` | `recommended`, `rating`, `price-asc`, or `price-desc` | `recommended` |

- Unknown or malformed values are ignored as if absent. They never reach the
  rendered output.
- Defaults are omitted from the URL. The canonical serialization order is the
  table order, so the same filters always produce the same query string.
- Price bands use `sessionPriceToman`: `under-700` is below 700,000 Toman,
  `700-850` is 700,000 through 850,000 inclusive, and `over-850` is above
  850,000.
- Recommended sorting is verified coaches first, then higher rating, then more
  reviews, then seeded order. Ties keep seeded order.
- Search matches the coach name or any specialty label, after trimming and
  normalizing Arabic yeh and kaf to Persian forms and treating the zero-width
  non-joiner as a space.
- The displayed rating and review count on cards and profiles are the seeded
  `rating` and `reviewCount` fields. Merging local reviews into that average is
  feature 10's contract.
- The profile review list is a sample of seeded review records; it is labeled
  with the number displayed and the seeded total.
- No child, student, or favorite data is placed in a URL. The only user-entered
  value in a URL is the coach search text.

## Testing

No test runner and no `Verify` command are configured, so this feature relies on
typecheck, lint, the production build, and browser evidence. The discovery
module is pure, but the testing gate is off; its behavior is verified through
the URL examples in the build steps.

Browser evidence, when a dev server is available:

1. `/coaches` at 360px, 768px, and 1280px with no horizontal overflow.
2. Search, each filter, sorting, chips, clear-all, the empty state, and the
   mobile filter sheet, checking that the URL matches the visible state.
3. Copied directory and profile URLs reopen the same view in a fresh tab.
4. Favorites toggled from a card and from a profile survive a reload and agree.
5. The profile of every seeded coach, and `/coaches/unknown-id` showing the
   not-found page.
6. The mobile navigation sheet and the header search at 360px.
7. Browser console has no errors and no request fails.

## Notes for the AI

- Server components stay the default. Only the directory state, filters,
  favorites, copy-link, and mobile navigation are Client Components.
- Use the `@/*` alias, `cn` from `@/lib/utils`, the existing primitives, and
  logical RTL classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`). No inline
  styles and no hardcoded colors.
- React Compiler is on: do not add `useMemo`, `useCallback`, or `memo`.
- Keep filtering, sorting, parsing, and query building in the pure discovery
  module so the server page and the client surface cannot disagree.
- User text is rendered as text through React. Never build HTML from a query
  parameter.
- Read `localStorage` only inside client code. The favorites hook must return an
  empty server snapshot so hydration output stays stable, then update after
  hydration.
- Use `next/image` for portraits with the seeded `alt`, explicit sizing, and a
  local source. No remote image hosts in this feature.
- Use `notFound()` for an unknown coach id, not a manually rendered error page.
- Do not add a booking button, a dashboard link, a coach preview overlay, or a
  dependency. If a required control would point at a missing route, leave it
  out and note it for the later feature.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":13745,"specSha256":"6db83e887802828418c51882450f56d784dcfd859f95ec173bd73a9950ac58ff","branch":"refs/heads/feature/global-chrome-coach-discovery-and-coach-profile","head":"12b55e4a47b198e425cab5d7ee3f411434654bcd","baseRef":"refs/heads/main","baseCommit":"12b55e4a47b198e425cab5d7ee3f411434654bcd","sourceTree":"4f25db12dc74404e7ecca7dfdb133de26fe4d54f","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev`, then open `http://localhost:3000/coaches?city=tehran&gender=female&sort=price-asc`

Expected:

"۲ مربی", the chips "تهران" and "مربی خانم", the sort control on "ارزان‌ترین", and cards for نگار کاظمی then سارا محمدی. Clicking either card opens its profile.

This proves:

URL-backed filtering, sorting, result count, chips, and profile links work together on the seeded data.
