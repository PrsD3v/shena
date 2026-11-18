# Feature: Design tokens, Persian typography, and Next.js root layout

**From build-plan:** feature 1
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/design-tokens-persian-typography-and-next-js-root-layout`

## Goal

Replace the neutral create-next-app foundation with Shena's own: the aquatic
color, radius, and spacing tokens, a self-hosted Vazirmatn typeface, a root
layout that is Persian and RTL from the document element down, and the Toman,
Persian digit, and Jalali date formatters. Every later screen consumes these
tokens and helpers instead of inventing its own.

## Design reference

- [`blueprint/reference/fitlite-style-guide.png`](../reference/fitlite-style-guide.png)
  supplies composition only: oversized display headings against small labels,
  one saturated color block per surface, thin borders, light surfaces.
- Palette, radii, and typography values are fixed by
  [`project-plan.md`](../project-plan.md) sections 7.3 to 7.5. That table wins
  where the reference and the plan disagree, and none of Fitlite's branding is
  reused.

## In scope

- Shena color tokens in `src/app/globals.css`: deep navy, primary blue, aqua,
  soft water, page background, surface, primary and secondary text, border,
  success, warning, error, plus the four card accent tints (aqua, sky, mint,
  sand) with navy text.
- The token layer the rest of the app reads: Tailwind `@theme inline` mappings
  and shadcn CSS variables (`background`, `foreground`, `card`, `popover`,
  `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`,
  `ring`, `sidebar-*`).
- Radius scale tuned to the plan: 16px cards, 12px inputs, pill buttons.
- Self-hosted Vazirmatn (variable weight, OFL 1.1) loaded through
  `next/font/local`, with the font files and license committed under
  `src/app/fonts/`. No font CDN, no Google Fonts request.
- `src/app/layout.tsx` as the standard App Router root layout:
  `<html lang="fa" dir="rtl">`, the Vazirmatn font variable, Shena metadata, and
  no Geist fonts.
- `src/lib/format.ts`: Persian digit conversion, grouped Persian numbers,
  Toman amounts, Jalali dates, weekday names, clock times, and session
  durations.
- A temporary foundation specimen at `/` that renders the palette, type scale,
  and formatter output, so the tokens and font can be seen and screenshotted.
  Build-plan item 5 replaces it with the real homepage.

## Out of scope

- Restyled primitives (button, input, select, badge, card, dialog, sheet,
  segmented control, rating, empty state): build-plan item 2. The existing
  `src/components/ui/button.tsx` keeps its generated styles but picks up the new
  tokens automatically.
- Header, footer, and mobile navigation: build-plan item 4.
- Homepage hero, search, coach cards, testimonials, and calls to action:
  build-plan item 5.
- Data models, seeded coaches, and storage helpers: build-plan item 3.
- Parsing Persian digits back to Latin for form input: that belongs with the
  validation work of build-plan item 6, where typed input exists.
- A dark theme: no toggle ships in this demo. The generated `.dark` block stays
  inert (class-scoped) so shadcn's `dark:` classes never activate from an OS
  preference.
- Chart tokens: no charts are planned, so those variables keep their generated
  values.

## Build loop

`workflow.stepReview` is `feature`: one review packet after all steps.
Checkpoint commits are disabled, so the working tree stays uncommitted for
review and `/complete` makes the feature commit. One step at a time, in order.

## Build steps

- [x] **Step 1 - Shena tokens in `globals.css`** - map the plan's palette onto
  the shadcn variables and Tailwind theme, add the brand and accent tint
  tokens, set the radius scale to 16px cards and 12px inputs, point
  `--font-sans` at the Vazirmatn variable, and replace the neutral `--font-mono`
  mapping with a system monospace stack. Spacing stays on Tailwind's standard
  4px-based scale instead of a parallel custom scale. *Done when:* `npm run
  build` and `npm run lint` pass, the served page's body background and text
  resolve from the new tokens rather than the generated neutral values, and no
  TSX file contains a hardcoded hex color.
- [x] **Step 2 - Self-host Vazirmatn and rebuild the root layout** - copy the
  variable woff2 and its OFL license into `src/app/fonts/`, load it with
  `next/font/local` in `src/app/layout.tsx`, set `<html lang="fa" dir="rtl">`,
  add Persian metadata, and remove the Geist font imports. *Done when:* the
  served document declares `lang="fa"` and `dir="rtl"`, the computed
  `font-family` resolves to Vazirmatn with `document.fonts` reporting it loaded,
  and the font file is served from the app's own origin with no font CDN
  request. The visual glyph check happens on the specimen in step 4.
- [x] **Step 3 - Formatters in `src/lib/format.ts`** - implement the contracts in
  Data / contracts below as dependency-free TypeScript. *Done when:* a scratch
  script outside the repository imports the module under Node 24 type stripping
  and prints the documented outputs for every listed case, including both
  Jalali anchors, zero, negative, and grouped amounts.
- [x] **Step 4 - Foundation specimen and evidence** - replace the
  create-next-app homepage with a temporary Persian RTL specimen that shows the
  palette, type scale, radii, and sample formatter output (no links, forms, or
  calls to action). *Done when:* dev-server screenshots at 360px, 768px, and
  1280px show Persian text in Vazirmatn, Persian digits from the formatters, and
  no horizontal overflow; `tsc --noEmit`, `npm run lint`, and `npm run build`
  pass.

## Files / areas

- `src/app/globals.css` - tokens, theme mappings, base layer.
- `src/app/layout.tsx` - font loading, document shell, metadata.
- `src/app/page.tsx` - temporary foundation specimen.
- `src/app/fonts/Vazirmatn-Variable.woff2`, `src/app/fonts/OFL.txt` - the
  self-hosted typeface and its license, taken from the official Vazirmatn
  33.003 release (SIL Open Font License 1.1, license retained).
- `src/lib/format.ts` - exported formatters.

## Data / contracts

All formatters are pure, synchronous, and dependency-free, so later features can
call them from server and client components alike.

| Export | Input | Output |
|---|---|---|
| `toPersianDigits` | `string \| number` | Same text with ASCII `0-9` replaced by `۰-۹`; grouping, separators, and other characters untouched |
| `formatNumber` | integer `number` | Persian digits with Persian thousands grouping, no decimals (`700000` becomes `۷۰۰٬۰۰۰`) |
| `formatToman` | integer `number` | `formatNumber` plus the unit (`700000` becomes `۷۰۰٬۰۰۰ تومان`) |
| `formatJalaliDate` | ISO date string `YYYY-MM-DD`, ISO instant string, or `Date` | Jalali day, month name, year (`2026-03-21` becomes `۱ فروردین ۱۴۰۵`) |
| `formatJalaliWeekday` | same as `formatJalaliDate` | Persian weekday name (`2026-03-21` becomes `شنبه`) |
| `formatTime` | `HH:mm` string | Persian digits, colon kept (`09:30` becomes `۰۹:۳۰`) |
| `formatDuration` | positive integer minutes | `۴۵ دقیقه`, `۱ ساعت`, `۱ ساعت و ۳۰ دقیقه` |

Date rules:

- A date-only string (`YYYY-MM-DD`) is a calendar date, not an instant. It is
  formatted in UTC so a browser in any timezone shows the same Jalali day.
- Any other ISO string or `Date` is an instant, formatted in `Asia/Tehran`,
  the demo's audience timezone.
- Month and weekday names come from the platform Persian locale through
  `Intl` with the `persian` calendar; no date library is added.
- A malformed date string throws instead of rendering a placeholder, so a bad
  value fails at the call site where it is produced.
- Persian digits appear in the interface only. Stored and linked values stay
  Latin ISO, as the plan requires, and no formatter is used to build a stored
  value.

Numeric rules: `formatNumber` and `formatToman` set `maximumFractionDigits: 0`,
so a fractional amount rounds to whole Toman and never renders decimals.
Negative amounts keep the locale minus sign; the domain amount is non-negative.
Non-finite input is a programming error and is not silently prettified.

Font contract: the CSS variable `--font-vazirmatn` is the single font source,
exposed as `--font-sans`; components use `font-sans` and never name a font
family directly.

## Testing

No test runner is configured, and `AGENTS.md` declares no `test` or `Verify`
command, so there is no test gate for this feature. Evidence:

- `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- A throwaway script under `$TMPDIR` that imports `src/lib/format.ts` and prints
  every documented case, with the two Jalali anchors `2026-03-21` (۱ فروردین
  ۱۴۰۵) and `2024-03-20` (۱ فروردین ۱۴۰۳) checked against known Nowruz dates.
  The script is not committed.
- Dev-server screenshots at 360px, 768px, and 1280px.

The formatters are exactly the pure logic that `coding-standards.md` says should
get tests once `/tests` configures a runner; this feature records that as a
follow-up rather than adding a runner mid-step.

## Notes for the AI

- Tailwind v4 is CSS-first: no `tailwind.config.js`, tokens live in
  `@theme inline` in `globals.css`.
- Do not add `useMemo`, `useCallback`, or `memo`; React Compiler is enabled.
- No inline `style` attributes and no hardcoded colors in components. Use the
  token utilities.
- RTL comes from logical properties and `dir="rtl"`; do not add physical
  `left`/`right` overrides.
- Keep the existing `cn` helper and the generated primitives untouched.
- `page.tsx` is a temporary specimen: no navigation, no forms, no invented
  product copy beyond short labels.
- No em dashes in code, comments, or copy.

## Open questions

None. The accent tint hex values are not pinned by the plan; this spec chooses
water-adjacent tints and keeps them behind tokens, so a later visual pass can
retune them without touching components.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":9976,"specSha256":"96d79b6ca2e7bb79af91faa2bfa613228086e3e0d107a0d10c0b0f088322baea","branch":"refs/heads/feature/design-tokens-persian-typography-and-next-js-root-layout","head":"7b6824468926fd25a4c5dd7783c2469e9d63a0d3","baseRef":"refs/heads/main","baseCommit":"7b6824468926fd25a4c5dd7783c2469e9d63a0d3","sourceTree":"eb52b5a6b4748adb8597aca1813724cd383f0757","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

```bash
npm run dev
```

Then open `http://localhost:3000`.

Expected: a Persian RTL specimen page in Vazirmatn with palette swatches, tint
cards, radius samples, and formatter rows reading `۷۰۰٬۰۰۰ تومان`,
`۱ فروردین ۱۴۰۵`, `شنبه`, `۰۹:۳۰`, `۱ ساعت و ۳۰ دقیقه`.

This proves: the tokens, the self-hosted font, the RTL document shell, and the
formatters are live in the running app.
