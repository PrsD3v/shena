# Feature: Shena component layer on Nova

**From build-plan:** feature 2
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/shena-component-layer-on-nova`

## Goal

Turn the generated Nova primitives into one Shena component layer so every later
screen composes from the same radii, borders, focus rings, RTL behavior, and
motion instead of restyling ad hoc. Ten primitives ship: button, input, select,
badge, card, dialog, sheet, segmented control, rating, and empty state.

## Design reference

- [`blueprint/reference/fitlite-card-collage.png`](../reference/fitlite-card-collage.png)
  - colorblock cards with navy text, pill actions, small labels, thin borders.
- [`blueprint/reference/fitlite-booking-modal.png`](../reference/fitlite-booking-modal.png)
  - centered white dialog, tinted summary block, thin dividers, segmented
    control, ghost cancel beside a pill primary action.
- [`blueprint/reference/fitlite-desktop-classes-sidebar.png`](../reference/fitlite-desktop-classes-sidebar.png)
  - badge pills, star rating, side panel, tag chips.

Colors, radii, and type come from the Shena tokens in `globals.css`; the
reference supplies composition and shapes only.

## In scope

- Generate `input`, `select`, `badge`, `card`, `dialog`, and `sheet` with the
  repo-local `shadcn` CLI (`base-nova` style) in `src/components/ui/`. The dry
  run confirms six new files, `button.tsx` skipped as identical, and no new
  dependency beyond the already-installed `cn`.
- Restyle every generated primitive plus the existing button as Shena: pill
  buttons, 12px inputs, 16px cards, 20px dialog and sheet panels, thin
  `border-border` edges instead of heavy rings, one focus treatment
  (`focus-visible` ring in the `--ring` color), and 150 to 200ms transitions
  that stop under `prefers-reduced-motion`.
- Mirror the generated physical placements for RTL: the dialog close button
  moves to the inline end, and the sheet exposes the physical `side` values its
  API already defines, with `side="right"` being the start side in this RTL app.
- Three Shena primitives that the Nova registry does not ship:
  `SegmentedControl` on Base UI `RadioGroup` (radio semantics: arrow keys move
  and select, visible checked state), `Rating` (display of 1 to 5 stars with the
  Persian numeric value and optional review count), and `EmptyState` (icon,
  title, description, and an action slot).
- `formatRating` in `src/lib/format.ts`, because ratings are fractional (`4.8`)
  while the existing `formatNumber` deliberately rounds money to whole Toman.
- A temporary component gallery on `/`, replacing the token specimen, with real
  triggers for dialog, sheet, select, and the segmented control so the
  interactive behavior can be observed. Build-plan item 5 replaces this page
  with the real homepage.

## Out of scope

- Coach, directory, profile, booking, dashboard, and layout components: items 4,
  5, 6, and 9.
- The review form's star input: item 10. `Rating` here displays a value; it does
  not collect one.
- Framer Motion: item 11. This feature uses CSS transitions only.
- Toasts, tooltips, tabs, and command menus: not in the build plan.
- A dark theme, and any change to `components.json` (probing showed the `rtl`
  flag changes nothing in these registry sources).
- Persisting or fetching anything.

## Build loop

`workflow.stepReview` is `feature`: one review packet after all steps.
Checkpoint commits are disabled. Work one step at a time and leave the branch
uncommitted for review; `/complete` makes the feature commit.

## Build steps

- [x] **Step 1 - generate the Nova primitives** - run the repo-local CLI for
  `input select badge card dialog sheet`, then read each generated file and
  record what needs a Shena pass (physical classes, ring-based borders, radii).
  *Done when:* the six files exist, `package.json` gained no dependency,
  `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass.
- [x] **Step 2 - build the temporary gallery** - replace the token specimen with
  a Client Component gallery on `/` that renders button, input, select, badge,
  card, a dialog trigger, a sheet trigger, and a short palette strip, keeping
  the token and formatter samples that still earn their place. *Done when:* the
  gallery renders every registry primitive with its generated styling, the
  dialog and sheet open from their triggers, and build, lint, and typecheck
  pass.
- [x] **Step 3 - restyle the seven primitives as Shena** - apply the radius,
  border, focus, motion, and RTL rules from In scope to `button`, `input`,
  `select`, `badge`, `card`, `dialog`, and `sheet`. *Done when:* the gallery
  shows the Shena radii, thin borders, and one focus ring style, the dialog and
  sheet still open and close with `Escape` and their triggers, and build, lint,
  and typecheck pass.
- [x] **Step 4 - add segmented control, rating, and empty state** - build the
  three Shena primitives with the contracts below, including `formatRating`,
  and give each a gallery section. *Done when:* the segmented control changes
  its value by click and arrow keys, the rating shows stars plus a Persian
  fractional value and optional count, the empty state renders inside a card,
  and build, lint, and typecheck pass.
- [x] **Step 5 - gallery evidence** - capture screenshots at 360px, 768px, and
  1280px, check focus order and visible focus, and confirm no console errors,
  no failed requests, and no horizontal overflow. *Done when:* every primitive
  appears in the screenshots, the dialog and sheet were opened through the UI,
  and the checks above pass.

## Files / areas

- `src/components/ui/button.tsx` (existing, restyled)
- `src/components/ui/{input,select,badge,card,dialog,sheet}.tsx` (generated, then
  restyled)
- `src/components/ui/{segmented-control,rating,empty-state}.tsx` (new Shena
  primitives)
- `src/lib/format.ts` (adds `formatRating`)
- `src/app/page.tsx` (temporary gallery, Client Component because it owns the
  interactive demos; item 5 replaces it)

## Data / contracts

| Primitive | Contract |
|---|---|
| `Button` | Existing `variant` and `size` API from Nova; pill radius by default; `focus-visible` ring in `--ring` |
| `Input` | Native input props; 12px radius, 1px `border-input`, error styling through `aria-invalid` |
| `Select` | Nova `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` API; trigger styled like `Input`; content on `bg-popover` with 12px radius |
| `Badge` | `variant`: `default` (navy), `secondary` (soft water), `accent-aqua`, `accent-sky`, `accent-mint`, `accent-sand`, `success`, `warning`, `destructive`; navy text on the accent tints |
| `Card` | Nova `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`; 16px radius, `border-border`, white surface, no heavy ring |
| `Dialog` | Nova dialog API; centered, 20px radius, `bg-card`, overlay `bg-brand-navy/20`; close button at the inline end; `Escape` and overlay click close it |
| `Sheet` | Nova sheet API with the registry's `side` prop (`top`, `right`, `bottom`, `left`); `side="right"` is the start side in RTL; overlay and close button match the dialog |
| `SegmentedControl` | `items: { value: string; label: string }[]`, `value: string`, `onValueChange(value: string)`, `aria-label` required, optional `className`; radio semantics on Base UI `RadioGroup`, the checked item uses `bg-card` inside a `bg-secondary` track |
| `Rating` | `value: number` (0 to 5), optional `count?: number`, optional `className`; renders five stars with filled state for `Math.round(value)`, `formatRating(value)`, and the count as `formatNumber(count)` plus «نظر»; exposes an `aria-label` with the same information; not interactive |
| `EmptyState` | `icon?: LucideIcon`, `title: string`, `description?: string`, `action?: React.ReactNode`, optional `className`; icon in an `bg-brand-water` circle, centered text |

Shared behavior:

- One focus treatment everywhere: `focus-visible` outline/ring in `--ring` with
  a 3px width and 50% opacity, never a different color per component.
- Radii come from the token scale: `rounded-lg` cards (16px), `rounded-md`
  inputs and content panels (12px), `rounded-full` buttons, badges, and the
  segmented track.
- Motion is CSS only and 150 to 200ms, with `motion-reduce:transition-none`
  where a transition exists. No meaning depends on motion.
- Persian text and digits come from the formatters; component props stay Latin
  (`value` strings, numbers in storage form).
- Numeric rating display uses one fraction digit (`4.8` becomes `۴٫۸`) and no
  grouping; money formatters are untouched.
- All components accept `className` and merge it with `cn`, as the existing
  button does.

## Testing

No test runner is configured and `AGENTS.md` declares no `test` or `Verify`
command, so there is no test gate. Evidence:

- `npx tsc --noEmit`, `npm run lint`, `npm run build` after each step.
- Production build served locally: screenshots at 360px, 768px, and 1280px of
  the gallery, with the dialog and sheet opened, the segmented control switched,
  and the rating and empty state visible.
- Keyboard pass: `Tab` reaches every trigger, focus is visible, `Escape` closes
  the dialog and sheet, and arrow keys move the segmented control selection.
- Console and network: no errors and no failed requests; the only font request
  stays the local woff2.
- No horizontal overflow at the three widths.

## Notes for the AI

- Add primitives with the CLI, not by hand; the CLI is local
  (`node_modules/.bin/shadcn`) and fetches from `ui.shadcn.com`, which the
  preflight confirmed reachable. No dependency install is expected.
- Do not add `useMemo`, `useCallback`, or `memo`; React Compiler is enabled.
- Keep `cn` from `@/lib/utils` and `'use client'` only in files with hooks or
  Base UI state.
- No inline `style` attributes and no hardcoded colors; every color and radius
  comes from tokens or Tailwind theme utilities.
- Use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) except
  where the registry API is explicitly physical, such as the sheet's `side`.
- Do not fork the generated APIs; adjust styles and, where needed, class
  composition only.
- No em dashes in code, comments, or copy.

## Open questions

None. Two reversible pre-decisions are recorded rather than asked: the sheet
keeps the registry's physical `side` values, and `Rating` displays a value
instead of collecting one, because item 10 owns the review form.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":10498,"specSha256":"0c78aed305cc05b436862d4fc6345808e92e71ffe0ad6b574877af0134dec99d","branch":"refs/heads/feature/shena-component-layer-on-nova","head":"76f5551bf09dbf93f9e805adc2bd25e055be0b48","baseRef":"refs/heads/main","baseCommit":"76f5551bf09dbf93f9e805adc2bd25e055be0b48","sourceTree":"b2f190667485bb5f188f235057d8c8eabe811135","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

```bash
npm run dev
```

Then open `http://localhost:3000`.

Expected: the Persian RTL component gallery with pill buttons, 12px inputs, a
city select, every badge variant, cards with tint blocks, the segmented control
switching between همه، حضوری، آنلاین, the rating `۴٫۸` with `۲۴ نظر`, the empty
state inside a card, and dialog and sheet triggers whose `بستن` button sits at
the inline end.

This proves: the Shena component layer renders from the tokens with RTL
placements, Persian copy, and working dialog, sheet, and segmented control
interactions.
